"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import InitialCapture from "@/components/InitialCapture";
import QuestionsFlow from "@/components/QuestionsFlow";
import FinalCapture from "@/components/FinalCapture";
import ResultScreen from "@/components/ResultScreen";
import Footer from "@/components/Footer";
import { captureAndPersistUtms, type UtmPayload } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";
import { computeScore, getMainBottleneck, getResultByScore } from "@/lib/scoring";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";

type Step = "welcome" | "initial" | "questions" | "final" | "result";

type InitialData = { name: string; profession: string };
type FinalData = {
  email: string;
  whatsapp: string;
  investmentCapacity: string;
  consent: boolean;
};

const STORAGE_KEY = "qac.session";

type StoredSession = {
  initial?: InitialData;
  answers?: number[];
};

function readSession(): StoredSession {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : {};
  } catch {
    return {};
  }
}

function writeSession(session: StoredSession) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // silencioso
  }
}

export default function HomePage() {
  const [step, setStep] = useState<Step>("welcome");
  const [initial, setInitial] = useState<InitialData>({
    name: "",
    profession: "",
  });
  const [answers, setAnswers] = useState<number[]>([]);
  const [utms, setUtms] = useState<UtmPayload>({
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const persisted = captureAndPersistUtms();
    setUtms(persisted);

    const session = readSession();
    if (session.initial?.name) {
      setInitial({
        name: session.initial.name,
        profession: session.initial.profession ?? "",
      });
    }
  }, []);

  const score = useMemo(
    () => (answers.length === QUIZ_QUESTIONS.length ? computeScore(answers) : 0),
    [answers],
  );

  const result = useMemo(
    () => (score ? getResultByScore(score) : null),
    [score],
  );

  const bottleneck = useMemo(
    () => (answers.length === QUIZ_QUESTIONS.length ? getMainBottleneck(answers) : null),
    [answers],
  );

  const handleStart = useCallback(() => {
    trackEvent("quiz_started");
    setStep("initial");
  }, []);

  const handleInitialSubmit = useCallback((data: InitialData) => {
    setInitial(data);
    writeSession({ initial: data });
    trackEvent("lead_started", { name: data.name, profession: data.profession });
    setStep("questions");
  }, []);

  const handleQuizComplete = useCallback(
    (collected: number[]) => {
      setAnswers(collected);
      writeSession({ initial, answers: collected });
      trackEvent("quiz_completed", { score: computeScore(collected) });
      setStep("final");
    },
    [initial],
  );

  const handleFinalSubmit = useCallback(
    async (data: FinalData) => {
      if (!result || !bottleneck) return;
      setSubmitting(true);
      const payload = {
        name: initial.name,
        profession: initial.profession,
        email: data.email,
        whatsapp: data.whatsapp,
        investmentCapacity: data.investmentCapacity,
        answers,
        totalScore: score,
        resultTitle: result.key,
        mainBottleneck: bottleneck.label,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        utm_source: utms.utmSource,
        utm_medium: utms.utmMedium,
        utm_campaign: utms.utmCampaign,
        utm_content: utms.utmContent,
        utm_term: utms.utmTerm,
      };

      try {
        await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // mantém o fluxo mesmo se a persistência falhar; resultado precisa aparecer.
      } finally {
        setSubmitting(false);
        trackEvent("result_viewed", {
          result: result.key,
          score,
          bottleneck: bottleneck.label,
        });
        setStep("result");
      }
    },
    [answers, bottleneck, initial, result, score, utms],
  );

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-6 sm:px-8 sm:py-10">
      <div className="flex-1">
        {step === "welcome" && <WelcomeScreen onStart={handleStart} />}

        {step === "initial" && (
          <InitialCapture
            defaultName={initial.name}
            defaultProfession={initial.profession}
            onSubmit={handleInitialSubmit}
          />
        )}

        {step === "questions" && (
          <QuestionsFlow
            name={initial.name}
            onComplete={handleQuizComplete}
          />
        )}

        {step === "final" && (
          <FinalCapture
            name={initial.name}
            submitting={submitting}
            onSubmit={handleFinalSubmit}
          />
        )}

        {step === "result" && result && bottleneck && (
          <ResultScreen
            name={initial.name}
            score={score}
            result={result}
            bottleneckLabel={bottleneck.label}
          />
        )}
      </div>

      <Footer />
    </main>
  );
}
