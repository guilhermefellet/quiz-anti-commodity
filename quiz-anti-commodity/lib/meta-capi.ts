import { createHash } from "node:crypto";

/**
 * Helper de Conversion API (Meta).
 * Documentação: https://developers.facebook.com/docs/marketing-api/conversions-api
 *
 * Server-side only. Os tokens NUNCA podem chegar ao client.
 *
 * Estratégia de deduplicação:
 * - Cliente dispara fbq('track', NAME, payload, { eventID })
 * - Server dispara CAPI com event_name=NAME e event_id=eventID
 * - Meta cruza pelos pares (event_name, event_id) e descarta o duplicado.
 */

const GRAPH_API_VERSION = "v21.0";

export type CapiUserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  externalId?: string;
  fbp?: string;
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
};

export type CapiEvent = {
  eventName: string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData: CapiUserData;
  customData?: Record<string, unknown>;
  actionSource?: "website" | "system_generated";
};

export type CapiResult =
  | { ok: true; events_received: number; fbtrace_id?: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; error: string; status?: number; body?: string };

function hash(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return undefined;
  return createHash("sha256").update(trimmed).digest("hex");
}

/**
 * Normaliza WhatsApp brasileiro pra E.164 (apenas dígitos com country code).
 * Aceita "21999999999" (DDD+9), "5521999999999" (já com 55), ou com máscara.
 */
export function normalizeWhatsappE164(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

function buildUserData(input: CapiUserData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (input.email) result.em = [hash(input.email)];
  if (input.phone) result.ph = [hash(input.phone)];
  if (input.firstName) result.fn = [hash(input.firstName)];
  if (input.externalId) result.external_id = [hash(input.externalId)];
  if (input.fbp) result.fbp = input.fbp;
  if (input.fbc) result.fbc = input.fbc;
  if (input.clientIpAddress) result.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) result.client_user_agent = input.clientUserAgent;
  return result;
}

export async function sendCapiEvent(event: CapiEvent): Promise<CapiResult> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;

  if (!pixelId) {
    return { ok: false, skipped: true, reason: "NEXT_PUBLIC_META_PIXEL_ID not set" };
  }
  if (!token) {
    return { ok: false, skipped: true, reason: "META_CAPI_ACCESS_TOKEN not set" };
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_id: event.eventId,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        action_source: event.actionSource ?? "website",
        event_source_url: event.eventSourceUrl,
        user_data: buildUserData(event.userData),
        custom_data: event.customData ?? {},
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${token}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    const text = await response.text();
    if (!response.ok) {
      return { ok: false, error: "graph_api_error", status: response.status, body: text };
    }
    let parsed: { events_received?: number; fbtrace_id?: string } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      // ignora parse silencioso, response 200 sem corpo padrão
    }
    return {
      ok: true,
      events_received: parsed.events_received ?? 0,
      fbtrace_id: parsed.fbtrace_id,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unknown",
    };
  }
}
