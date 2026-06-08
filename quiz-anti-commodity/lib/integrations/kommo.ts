/**
 * Stub para integração com Kommo CRM.
 *
 * IMPORTANTE: esta é a 2ª etapa do roadmap de integrações e ainda NÃO
 * está ativa. Por enquanto a entrada de leads no Kommo deve acontecer
 * via cenário do Make (lib/integrations/make.ts), que pode chamar a
 * API do Kommo ou criar o lead a partir da linha gravada no Sheets.
 *
 * Esta função será preenchida quando o time decidir mover a criação do
 * lead para o servidor da aplicação, com chamada direta à API do Kommo
 * (geralmente OAuth2 com long-lived token e mapeamento de pipeline/etapa).
 *
 * NÃO importar nem chamar esta função no route.ts enquanto estiver como stub.
 */

import type { MakeWebhookPayload } from "./make";

export type KommoPayload = MakeWebhookPayload;

export type KommoResult =
  | { ok: true; leadId: string | number }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; error: string };

export async function sendToKommo(
  _payload: KommoPayload,
): Promise<KommoResult> {
  return {
    ok: false,
    skipped: true,
    reason:
      "Kommo integration not implemented yet, will be activated in step 2 of the integrations roadmap",
  };
}
