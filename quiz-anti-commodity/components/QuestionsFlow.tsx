"use client";

import { useEffect, useMemo, useState } from "react";
import BrandHeader from "./BrandHeader";
import ProgressBar from "./ProgressBar";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";

type Props = {
  name: string;
  onComplete: (answers: number[]) => void;
};

export default function QuestionsFlow({ name, onComplete }: Props) {
  const total = QUIZ_QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(total).fill(0));
  const [selected, setSelected] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const question = useMemo(() => QUIZ_QUESTIONS[index], [index]);
  const isLast = index === total - 1;

  useEffect(() => {
    const stored = answers[index];
    setSelected(stored && stored > 0 ? stored : null);
    setAnimKey((value) => value + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function handleSelect(score: number) {
    setSelected(score);
  }

  function handleBack() {
    if (index === 0) return;
    setIndex((value) => value - 1);
  }

  function handleNext() {
    if (selected === null) return;
    const updated = [...answers];
    updated[index] = selected;
    setAnswers(updated);

    if (isLast) {
      onComplete(updated);
      return;
    }

    setIndex((value) => value + 1);
  }

  return (
    <section className="fade-in">
      <BrandHeader />

      <ProgressBar current={index + 1} total={total} />

      <div key={animKey} className="card-base fade-in sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-kicker text-brand-accent">
          {name ? `${name}, vamos lá` : "Diagnóstico"}
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-night-ink sm:text-3xl">
          {question.title}
        </h2>

        <div className="mt-6 space-y-3">
          {question.options.map((option) => {
            const active = selected === option.score;
            return (
              <button
                key={option.text}
                type="button"
                onClick={() => handleSelect(option.score)}
                className={[
                  "w-full rounded-2xl border px-4 py-4 text-left text-sm font-medium leading-snug transition-all duration-200",
                  active
                    ? "border-brand-accent bg-night-raised text-night-ink ring-1 ring-brand-accent/50"
                    : "border-night-line bg-night-raised text-night-soft hover:border-brand-accent hover:text-night-ink",
                ].join(" ")}
                aria-pressed={active}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-night-mute">
          Toque na sua resposta para continuar.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleNext}
            disabled={selected === null}
            className="btn-primary"
          >
            {isLast ? "Ver meu resultado" : "Próxima"}
          </button>
        </div>

        {index > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-medium text-night-mute transition-colors hover:text-night-ink"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
