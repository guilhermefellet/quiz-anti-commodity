/**
 * Integração com Make.com via webhook.
 *
 * Lê MAKE_WEBHOOK_URL do ambiente (server-side, nunca exposto ao client).
 * Se a variável não estiver configurada, retorna skipped sem lançar erro,
 * permitindo que o quiz continue funcionando normalmente.
 *
 * Use o cenário do Make como hub: a partir do webhook, ramifique para
 * Google Sheets, Kommo, e-mail e outras automações.
 */

import type { QuizSubmissionRecord } from "@/lib/types";

export type MakeWebhookPayload = QuizSubmissionRecord;

export type MakeWebhookResult =
  | { ok: true; status: number }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; error: string };

const TIMEOUT_MS = 5000;

export async function sendToMakeWebhook(
  payload: MakeWebhookPayload,
): Promise<MakeWebhookResult> {
  const url = process.env.MAKE_WEBHOOK_URL;

  if (!url || url.trim() === "") {
    const result: MakeWebhookResult = {
      ok: false,
      skipped: true,
      reason: "MAKE_WEBHOOK_URL not set",
    };
    console.log("[make] skipped", result.reason);
    return result;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMsg = `HTTP ${response.status}`;
      console.log("[make] error", errorMsg);
      return { ok: false, error: errorMsg };
    }

    console.log("[make] ok", { status: response.status, id: payload.id });
    return { ok: true, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);
    const message =
      error instanceof Error
        ? error.name === "AbortError"
          ? "timeout after 5s"
          : error.message
        : "unknown error";
    console.log("[make] error", message);
    return { ok: false, error: message };
  }
}
