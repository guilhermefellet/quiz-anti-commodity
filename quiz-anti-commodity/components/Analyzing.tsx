"use client";

import { useEffect, useState } from "react";
import BrandHeader from "./BrandHeader";
import { capitalizeFirstName } from "@/lib/format";

type Props = {
  name: string;
};

const MESSAGES = [
  "Analisando suas respostas...",
  "Mapeando seu modelo de receita...",
  "Identificando o principal gargalo...",
  "Calibrando seu diagnóstico final...",
];

const STEP_DURATION_MS = 1100;

export default function Analyzing({ name }: Props) {
  const [index, setIndex] = useState(0);
  const firstName = capitalizeFirstName(name);

  useEffect(() => {
    if (index >= MESSAGES.length - 1) return;
    const timer = setTimeout(() => {
      setIndex((value) => value + 1);
    }, STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="fade-in">
      <BrandHeader />

      <div className="card-base flex flex-col items-center px-6 py-16 sm:p-12 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-kicker text-night-mute">
          Diagnóstico em andamento
        </p>

        <div className="relative mt-7 h-14 w-14">
          <span className="absolute inset-0 rounded-full border-2 border-night-line" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-accent" />
        </div>

        <p className="mt-8 text-center font-serif text-2xl font-semibold leading-tight text-night-ink sm:text-3xl">
          {firstName ? `${firstName}, estamos quase lá.` : "Estamos quase lá."}
        </p>

        <p
          key={index}
          className="mt-5 min-h-[1.5rem] fade-in text-center text-sm text-night-soft"
        >
          {MESSAGES[index]}
        </p>
      </div>
    </section>
  );
}
