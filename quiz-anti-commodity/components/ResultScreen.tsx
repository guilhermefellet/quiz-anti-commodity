"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Share2, Target } from "lucide-react";
import BrandHeader from "./BrandHeader";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { capitalizeFirstName } from "@/lib/format";
import type { ResultProfile } from "@/lib/quiz-data";

type Props = {
  name: string;
  score: number;
  result: ResultProfile;
  bottleneckLabel: string;
};

function toneStyles(tone: ResultProfile["tone"]) {
  switch (tone) {
    case "danger":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
    case "warn":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-100";
    case "info":
      return "bg-sky-50 text-sky-800 ring-1 ring-sky-100";
    case "good":
    default:
      return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100";
  }
}

export default function ResultScreen({
  name,
  score,
  result,
  bottleneckLabel,
}: Props) {
  const [shareStatus, setShareStatus] = useState<
    "idle" | "copied" | "shared" | "error"
  >("idle");
  const [showFallback, setShowFallback] = useState(false);

  const firstName = useMemo(() => capitalizeFirstName(name), [name]);

  const whatsappLink = useMemo(
    () =>
      buildWhatsappLink({
        result: result.key,
        bottleneck: bottleneckLabel,
      }),
    [result.key, bottleneckLabel],
  );

  function handleWhatsapp() {
    trackEvent("whatsapp_clicked", {
      result: result.key,
      bottleneck: bottleneckLabel,
    });
  }

  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const shareText = `Fiz o Termômetro Anti-Commodity e meu resultado foi: ${result.key}.`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Meu resultado no Termômetro Anti-Commodity",
          text: shareText,
          url: shareUrl,
        });
        setShareStatus("shared");
        return;
      } catch {
        setShowFallback(true);
        return;
      }
    }

    setShowFallback(true);
  }

  async function handleCopy() {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    }
  }

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <section className="fade-in">
      <BrandHeader />

      <div className="card-base sm:p-8">
        <p className="text-sm font-medium text-brand-mute">
          {firstName ? `Pronto, ${firstName}. Seu resultado é:` : "Seu resultado é:"}
        </p>

        <div
          className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${toneStyles(result.tone)}`}
        >
          {result.key}
        </div>

        <p className="mt-2 text-sm font-medium text-brand-mute">
          {`Você marcou ${score} de 28 pontos`}
        </p>

        <h2 className="mt-4 text-xl font-semibold leading-snug text-brand-ink sm:text-2xl">
          {result.headline}
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-brand-slate sm:text-base">
          {result.description}
        </p>

        <div className="mt-6 rounded-2xl bg-brand-ink p-5 text-white">
          <div className="flex items-center gap-2">
            <Target size={18} strokeWidth={1.75} />
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Seu principal gargalo agora
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold leading-snug">
            {bottleneckLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Esse é o ponto que mais segura sua entrada em um nível superior de
            posicionamento e captação. É por aqui que o próximo passo precisa
            começar.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
            O que isso significa na prática
          </p>
          <ul className="mt-3 space-y-2">
            {result.practice.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-ink"
              >
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-brand-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-mute">
            Seu próximo passo
          </p>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink sm:text-base">
            {result.nextStep}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsapp}
            className="btn-primary"
          >
            Continuar meu plano pelo WhatsApp
            <ExternalLink size={16} strokeWidth={2} className="ml-2" />
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="btn-secondary"
          >
            <Share2 size={16} strokeWidth={2} className="mr-2" />
            Compartilhar meu resultado
          </button>
        </div>

        {shareStatus === "shared" && (
          <p className="mt-3 text-xs font-medium text-emerald-700">
            Compartilhamento aberto.
          </p>
        )}

        {showFallback && (
          <div className="mt-4 rounded-2xl border border-brand-line bg-brand-soft p-4">
            <label
              className="field-label"
              htmlFor="share-url"
            >
              Link do seu teste
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="share-url"
                type="text"
                readOnly
                value={shareUrl}
                className="field-input"
                onFocus={(event) => event.currentTarget.select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-ink px-4 text-sm font-semibold text-white transition-colors hover:brightness-110"
              >
                <Copy size={16} strokeWidth={2} className="mr-2" />
                Copiar
              </button>
            </div>
            {shareStatus === "copied" && (
              <p className="mt-2 text-xs font-medium text-emerald-700">
                Link copiado.
              </p>
            )}
            {shareStatus === "error" && (
              <p className="mt-2 text-xs font-medium text-rose-700">
                Não foi possível copiar. Selecione manualmente.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
