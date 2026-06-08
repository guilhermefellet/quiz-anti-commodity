"use client";

import { useState } from "react";
import BrandHeader from "./BrandHeader";

type Props = {
  name: string;
  submitting: boolean;
  onSubmit: (data: {
    email: string;
    whatsapp: string;
    investmentCapacity: string;
    consent: boolean;
  }) => void;
};

const INVESTMENT_OPTIONS = ["Sim", "Não"];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidWhatsapp(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export default function FinalCapture({ name, submitting, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [investmentCapacity, setInvestmentCapacity] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    whatsapp?: string;
    investmentCapacity?: string;
    consent?: string;
  }>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!isValidEmail(email.trim())) {
      next.email = "Informe um email válido.";
    }
    if (!isValidWhatsapp(whatsapp.trim())) {
      next.whatsapp = "Informe WhatsApp com DDD (10 ou 11 dígitos).";
    }
    if (!investmentCapacity) {
      next.investmentCapacity = "Selecione uma opção de investimento.";
    }
    if (!consent) {
      next.consent = "Você precisa confirmar para receber seu resultado.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      email: email.trim(),
      whatsapp: whatsapp.replace(/\D/g, ""),
      investmentCapacity,
      consent,
    });
  }

  return (
    <section className="fade-in">
      <BrandHeader />

      <div className="card-base sm:p-8">
        <h2 className="text-2xl font-semibold leading-tight text-brand-ink sm:text-3xl">
          {name ? `${name}, seu resultado está pronto.` : "Seu resultado está pronto."}{" "}
          Para liberar seu plano inicial, preencha seus contatos.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-slate">
          Assim você também consegue continuar a conversa com a Anna Mattei pelo
          WhatsApp, se fizer sentido para o seu momento.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="field-input"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm font-medium text-rose-600"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="whatsapp">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              className="field-input"
              placeholder="DDD + número"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              aria-invalid={Boolean(errors.whatsapp)}
              aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            />
            {errors.whatsapp && (
              <p
                id="whatsapp-error"
                className="mt-2 text-sm font-medium text-rose-600"
              >
                {errors.whatsapp}
              </p>
            )}
          </div>

          <div>
            <p className="field-label">
              Você estaria disposto a investir em um plano prático para aumentar sua autoridade e seu faturamento nos próximos meses?
            </p>
            <div className="mt-3 space-y-3">
              {INVESTMENT_OPTIONS.map((option) => {
                const active = investmentCapacity === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setInvestmentCapacity(option)}
                    className={[
                      "w-full rounded-2xl border px-4 py-4 text-left text-sm font-medium leading-snug transition-all duration-200",
                      active
                        ? "border-brand-accent bg-brand-ink text-white shadow-card"
                        : "border-brand-line bg-white text-brand-ink hover:border-brand-accent hover:bg-brand-soft",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {errors.investmentCapacity && (
              <p className="mt-2 text-sm font-medium text-rose-600">
                {errors.investmentCapacity}
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-slate">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-brand-line text-brand-accent focus:ring-brand-accent"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              Concordo em receber meu resultado e comunicações sobre o próximo
              passo do Consultor 10K.
            </span>
          </label>
          {errors.consent && (
            <p className="text-sm font-medium text-rose-600">{errors.consent}</p>
          )}


          <div className="rounded-2xl border border-brand-line bg-white px-4 py-4 text-sm leading-relaxed text-brand-slate">
            <p className="font-semibold text-brand-ink">Agora, você pode conversar com a Ana.</p>
            <p className="mt-2">
              A Ana faz parte da equipe Lucro Recorrente e é especialista em ajudar
              educadores, consultores e planejadores financeiros a transformar
              autoridade em um plano prático de crescimento. Ela vai te ajudar a
              entender os próximos passos para aplicar esse diagnóstico no seu
              momento atual.
            </p>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Liberando..." : "Liberar meu resultado"}
          </button>

          <p className="text-xs leading-relaxed text-brand-mute">
            Sem spam. Seus dados serão usados apenas para enviar seu resultado e
            dar continuidade ao plano, caso você solicite.
          </p>
        </form>
      </div>
    </section>
  );
}
