"use client";

import { useState } from "react";
import BrandHeader from "./BrandHeader";

type Props = {
  defaultName?: string;
  defaultProfession?: string;
  onSubmit: (data: { name: string; profession: string }) => void;
};

export default function InitialCapture({
  defaultName = "",
  defaultProfession = "",
  onSubmit,
}: Props) {
  const [name, setName] = useState(defaultName);
  const [profession, setProfession] = useState(defaultProfession);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Informe seu nome para continuar.");
      return;
    }
    setError(null);
    onSubmit({ name: trimmed, profession: profession.trim() });
  }

  return (
    <section className="fade-in">
      <BrandHeader />

      <div className="card-base sm:p-10">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-night-ink sm:text-4xl">
          Antes de começar, como posso te chamar?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-night-soft">
          Esses dados servem só para personalizar seu diagnóstico.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label className="field-label" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              type="text"
              autoComplete="given-name"
              className="field-input"
              placeholder="Seu primeiro nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "name-error" : undefined}
            />
            {error && (
              <p
                id="name-error"
                className="mt-2 text-sm font-medium text-tone-danger"
              >
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="field-label" htmlFor="profession">
              Profissão (opcional)
            </label>
            <input
              id="profession"
              type="text"
              autoComplete="organization-title"
              className="field-input"
              placeholder="Ex: consultor financeiro, planejador, educador financeiro..."
              value={profession}
              onChange={(event) => setProfession(event.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            Responder às 7 perguntas
          </button>
        </form>
      </div>
    </section>
  );
}
