import { NextResponse } from "next/server";
import { sendCapiEvent, normalizeWhatsappE164 } from "@/lib/meta-capi";

/**
 * Endpoint pra repassar eventos client-side ao CAPI (server-side).
 *
 * Usado por eventos que nascem só no client e precisam de cobertura server
 * pra resistir a iOS17 / AdBlock / SKAdNetwork. Ex: Contact (clique WhatsApp).
 *
 * Lead também tem dispatch server-side, mas vai direto dentro do
 * /api/quiz/submit pra reaproveitar nome/email/whatsapp já validados.
 */

type TrackPayload = {
  eventName?: string;
  eventId?: string;
  eventSourceUrl?: string;
  email?: string;
  whatsapp?: string;
  firstName?: string;
  externalId?: string;
  customData?: Record<string, unknown>;
};

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") ?? undefined;
}

function getCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export async function POST(request: Request) {
  let body: TrackPayload;
  try {
    body = (await request.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const eventName = (body.eventName ?? "").trim();
  const eventId = (body.eventId ?? "").trim();

  if (!eventName || !eventId) {
    return NextResponse.json(
      { ok: false, error: "missing_event_name_or_id" },
      { status: 400 },
    );
  }

  const userAgent = request.headers.get("user-agent") ?? undefined;
  const ip = getClientIp(request);
  const cookieHeader = request.headers.get("cookie");
  const fbp = getCookieValue(cookieHeader, "_fbp");
  const fbc = getCookieValue(cookieHeader, "_fbc");

  const result = await sendCapiEvent({
    eventName,
    eventId,
    eventSourceUrl: body.eventSourceUrl,
    userData: {
      email: body.email,
      phone: body.whatsapp ? normalizeWhatsappE164(body.whatsapp) : undefined,
      firstName: body.firstName,
      externalId: body.externalId,
      fbp,
      fbc,
      clientIpAddress: ip,
      clientUserAgent: userAgent,
    },
    customData: body.customData,
  });

  console.log("[track]", { eventName, eventId, result });

  return NextResponse.json({ ok: true, result });
}
