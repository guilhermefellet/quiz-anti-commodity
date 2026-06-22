/**
 * Ponto único de instrumentação de eventos do quiz.
 *
 * - Mapeia eventos internos do quiz para eventos do Meta Pixel (padrão + custom).
 * - Gera event_id por evento para deduplicação client (fbq) + server (CAPI).
 * - Dispara fbq client-side quando o Pixel está carregado.
 * - console.log em dev pra inspeção rápida.
 *
 * Os disparos server-side (CAPI) acontecem em:
 *   - app/api/quiz/submit/route.ts (Lead)
 *   - app/api/track/route.ts (Contact e demais)
 *
 * O caller passa um eventId opcional. Se passar, é o mesmo que vai pro server,
 * garantindo deduplicação. Se não passar, geramos um aleatório aqui.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type QuizEventName =
  | "quiz_started"
  | "lead_started"
  | "quiz_completed"
  | "result_viewed"
  | "whatsapp_clicked";

type PixelMapping = {
  pixelName: string;
  custom: boolean;
};

const PIXEL_MAP: Record<QuizEventName, PixelMapping> = {
  quiz_started: { pixelName: "ViewContent", custom: false },
  lead_started: { pixelName: "QuizStarted", custom: true },
  quiz_completed: { pixelName: "QuizCompleted", custom: true },
  result_viewed: { pixelName: "Lead", custom: false },
  whatsapp_clicked: { pixelName: "Contact", custom: false },
};

function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function trackEvent(
  event: QuizEventName,
  payload?: Record<string, unknown>,
  options?: { eventId?: string },
): string {
  const eventId = options?.eventId ?? generateEventId();
  const mapping = PIXEL_MAP[event];

  if (typeof window === "undefined") {
    return eventId;
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[track]", event, { eventId, ...payload });
  }

  if (typeof window.fbq === "function" && mapping) {
    const method = mapping.custom ? "trackCustom" : "track";
    window.fbq(method, mapping.pixelName, payload ?? {}, { eventID: eventId });
  }

  return eventId;
}
