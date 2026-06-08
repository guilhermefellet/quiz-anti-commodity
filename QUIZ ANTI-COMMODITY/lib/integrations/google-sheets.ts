/**
 * Stub para integração direta com Google Sheets.
 *
 * IMPORTANTE: este arquivo é um esqueleto para etapa futura do roadmap.
 * Hoje a integração com Sheets acontece via Make (lib/integrations/make.ts),
 * que pode escrever direto na planilha como uma das ações do cenário.
 *
 * Esta função só será implementada se o time decidir não depender do Make
 * e enviar do servidor direto para a Google Sheets API, geralmente via
 * service account com escopo restrito à planilha de leads.
 *
 * NÃO importar nem chamar esta função no route.ts enquanto estiver como stub.
 */

import type { MakeWebhookPayload } from "./make";

export type GoogleSheetsPayload = MakeWebhookPayload;

export type GoogleSheetsResult =
  | { ok: true; rowsAppended: number }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; error: string };

export async function sendToGoogleSheets(
  _payload: GoogleSheetsPayload,
): Promise<GoogleSheetsResult> {
  return {
    ok: false,
    skipped: true,
    reason: "Google Sheets integration not implemented yet",
  };
}
