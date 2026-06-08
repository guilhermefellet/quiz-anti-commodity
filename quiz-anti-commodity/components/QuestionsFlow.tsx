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
    setSelected(null);
    setAnimKey((value) => value + 1);
  }, [index]);

  function handleSelect(score: number) {
    setSelected(score);
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

      <div key={animKey} className="card-base fade-in sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          {name ? `${name}, vamos lá` : "Diagnóstico"}
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-brand-ink sm:text-2xl">
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
                    ? "border-brand-accent bg-brand-ink text-white shadow-card"
                    : "border-brand-line bg-white text-brand-ink hover:border-brand-accent hover:bg-brand-soft",
                ].join(" ")}
                aria-pressed={active}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <div className="mt-7">
          <button
            type="button"
            onClick={handleNext}
            disabled={selected === null}
            className="btn-primary"
          >
            {isLast ? "Ver meu resultado" : "Próxima"}
          </button>
        </div>
      </div>
    </section>
  );
}
