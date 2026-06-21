"use client";

import { Timer, Compass, ArrowRight } from "lucide-react";
import BrandHeader from "./BrandHeader";

type Props = {
  onStart: () => void;
};

const BENEFITS = [
  {
    icon: Timer,
    text: "Diagnóstico em menos de 2 minutos",
  },
  {
    icon: Compass,
    text: "Onde está seu teto hoje e por que",
  },
  {
    icon: ArrowRight,
    text: "Próximo passo concreto pra sair do 1 a 1",
  },
];

export default function WelcomeScreen({ onStart }: Props) {
  return (
    <section className="fade-in">
      <BrandHeader />

      <div className="card-base sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-kicker text-night-mute">
          Diagnóstico Consultor 10K
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-night-ink sm:text-4xl">
          Você é percebido como autoridade financeira ou como só mais um
          consultor no mercado?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-night-soft">
          Sete perguntas rápidas que mostram se sua comunicação, oferta e
          captação te posicionam como escolha óbvia ou te empurram pra mesma
          prateleira de todos os outros consultores financeiros.
        </p>

        <ul className="mt-7 space-y-3">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-2xl border border-night-line bg-night-raised px-4 py-3"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night-bg text-brand-accent ring-1 ring-night-line">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-night-ink">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <button type="button" onClick={onStart} className="btn-primary">
            Quero ver onde meu modelo trava
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-night-mute">
          A resposta sincera sobre onde seu modelo de receita trava. Para CFP,
          CPA, ANCORD e planejadores certificados que ainda dependem do 1 a 1.
        </p>
      </div>
    </section>
  );
}
