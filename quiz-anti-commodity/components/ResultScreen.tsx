"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import BrandHeader from "./BrandHeader";
import Thermometer from "./Thermometer";
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

type Tone = ResultProfile["tone"];

const TONE_TEXT: Record<Tone, string> = {
  danger: "text-tone-danger",
  warn: "text-tone-warn",
  info: "text-tone-info",
  good: "text-tone-good",
};

const TONE_RING: Record<Tone, string> = {
  danger: "ring-tone-danger/50",
  warn: "ring-tone-warn/50",
  info: "ring-tone-info/50",
  good: "ring-tone-good/50",
};

const TONE_DOT: Record<Tone, string> = {
  danger: "bg-tone-danger",
  warn: "bg-tone-warn",
  info: "bg-tone-info",
  good: "bg-tone-good",
};

function splitFirstSentence(text: string): [string, string] {
  const match = text.match(/^([^.!?]+[.!?])([\s\S]*)$/);
  if (!match) return [text, ""];
  return [match[1], (match[2] ?? "").trim()];
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

  const [leadSentence, restDescription] = useMemo(
    () => splitFirstSentence(result.description),
    [result.description],
  );

  const whatsappLink = useMemo(
    () =>
      buildWhatsappLink({
        result: result.key,
        bottleneck: bottleneckLabel,
      }),
    [result.key, bottleneckLabel],
  );

  function handleWhatsapp() {
    const eventId = trackEvent(
      "whatsapp_clicked",
      {
        result: result.key,
        bottleneck: bottleneckLabel,
      },
    );
    // Dispatch CAPI server-side em paralelo. keepalive garante envio
    // mesmo se a aba navegar pro WhatsApp Web imediatamente após o clique.
    try {
      void fetch("/api/track", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "Contact",
          eventId,
          eventSourceUrl:
            typeof window !== "undefined" ? window.location.href : "",
          firstName: firstName || undefined,
          customData: {
            result: result.key,
            bottleneck: bottleneckLabel,
          },
        }),
      });
    } catch {
      // silencioso: tracking nunca derruba UX
    }
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

      <article className="overflow-hidden rounded-2xl bg-night-bg text-night-ink shadow-editorial ring-1 ring-night-line">
        <div className="px-6 pb-8 pt-10 sm:px-10 sm:pt-12">
          <p className="text-center text-xs font-semibold uppercase tracking-kicker text-night-mute">
            Seu diagnóstico
          </p>

          <div className="mt-6">
            <Thermometer score={score} tone={result.tone} />
          </div>

          <div className="mt-6 flex justify-center">
            <span
              className={`inline-flex items-center rounded-full bg-transparent px-4 py-1.5 text-[11px] font-semibold uppercase tracking-kicker ring-1 ${TONE_RING[result.tone]} ${TONE_TEXT[result.tone]}`}
            >
              {result.key}
            </span>
          </div>

          <h2 className="mt-6 text-center font-serif text-4xl font-semibold leading-tight tracking-tight text-night-ink sm:text-5xl">
            {result.key}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-night-soft sm:text-lg">
            {result.headline}
          </p>

          <div className="mx-auto mt-8 h-px max-w-md bg-night-line" />

          <p className="mt-8 text-[15px] leading-relaxed text-night-soft sm:text-base">
            {firstName ? `${firstName}, ` : ""}
            <span className={`font-medium ${TONE_TEXT[result.tone]}`}>
              {leadSentence}
            </span>
            {restDescription ? ` ${restDescription}` : ""}
          </p>

          <section className="mt-8 rounded-2xl bg-night-surface p-6 ring-1 ring-night-line">
            <p className="text-[11px] font-semibold uppercase tracking-kicker text-night-mute">
              Seu principal gargalo agora
            </p>
            <p className="mt-3 font-serif text-2xl font-semibold leading-snug text-night-ink sm:text-3xl">
              {bottleneckLabel}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-night-soft">
              É por aqui que o próximo passo precisa começar. Esse é o ponto que
              mais segura sua entrada em um nível superior de posicionamento e
              captação.
            </p>
          </section>

          <section className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-kicker text-night-mute">
              O que isso significa na prática
            </p>
            <ul className="mt-4 space-y-3">
              {result.practice.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-night-soft"
                >
                  <span
                    aria-hidden
                    className={`mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${TONE_DOT[result.tone]}`}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-2xl border border-night-line bg-night-bg p-6">
            <p className="text-[11px] font-semibold uppercase tracking-kicker text-night-mute">
              Seu próximo passo
            </p>
            <p className="mt-3 text-base leading-relaxed text-night-ink">
              {result.nextStep}
            </p>
          </section>

          <div className="mt-9 flex flex-col gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsapp}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-brand-accent px-6 text-base font-semibold text-white shadow-cta transition-transform duration-200 ease-out hover:brightness-110 active:scale-[0.99]"
            >
              Continuar meu plano pelo WhatsApp
              <ExternalLink size={16} strokeWidth={2} className="ml-2" />
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-night-line bg-transparent px-6 text-base font-semibold text-night-ink transition-colors duration-200 hover:bg-night-surface"
            >
              <Share2 size={16} strokeWidth={2} className="mr-2" />
              Compartilhar meu resultado
            </button>
          </div>

          {shareStatus === "shared" && (
            <p className="mt-3 text-xs font-medium text-tone-good">
              Compartilhamento aberto.
            </p>
          )}

          {showFallback && (
            <div className="mt-4 rounded-2xl border border-night-line bg-night-surface p-4">
              <label
                className="mb-2 block text-sm font-medium text-night-soft"
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
                  className="h-12 w-full rounded-2xl border border-night-line bg-night-bg px-4 text-base text-night-ink outline-none transition-colors duration-200 placeholder:text-night-mute focus:border-tone-warn"
                  onFocus={(event) => event.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-night-raised px-4 text-sm font-semibold text-night-ink transition-colors hover:brightness-110"
                >
                  <Copy size={16} strokeWidth={2} className="mr-2" />
                  Copiar
                </button>
              </div>
              {shareStatus === "copied" && (
                <p className="mt-2 text-xs font-medium text-tone-good">
                  Link copiado.
                </p>
              )}
              {shareStatus === "error" && (
                <p className="mt-2 text-xs font-medium text-tone-danger">
                  Não foi possível copiar. Selecione manualmente.
                </p>
              )}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
