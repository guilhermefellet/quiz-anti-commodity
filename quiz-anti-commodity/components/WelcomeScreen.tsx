"use client";

import { Timer, Compass, ArrowRight } from "lucide-react";
import BrandHeader from "./BrandHeader";

type Props = {
  onStart: () => void;
};

const BENEFITS = [
  {
    icon: Timer,
    text: "Resultado em menos de 2 minutos",
  },
  {
    icon: Compass,
    text: "Leitura prática sobre seu posicionamento",
  },
  {
    icon: ArrowRight,
    text: "Próximo passo claro para sair da comparação",
  },
];

export default function WelcomeScreen({ onStart }: Props) {
  return (
    <section className="fade-in">
      <BrandHeader />

      <div className="card-base sm:p-8">
        <h1 className="text-2xl font-semibold leading-tight text-brand-ink sm:text-3xl">
          Você é percebido como autoridade financeira ou como só mais um
          consultor no mercado?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-slate">
          Responda 7 perguntas rápidas e descubra se sua comunicação, oferta e
          captação estão te posicionando como escolha óbvia, ou te colocando na
          mesma prateleira de todos os outros.
        </p>

        <ul className="mt-6 space-y-3">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-2xl bg-brand-soft px-4 py-3"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink shadow-card">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-brand-ink">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7">
          <button type="button" onClick={onStart} className="btn-primary">
            Começar o teste
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-brand-mute">
          Sem enrolação. Sem fórmula genérica. Apenas uma leitura direta sobre o
          seu momento atual.
        </p>
      </div>
    </section>
  );
}
