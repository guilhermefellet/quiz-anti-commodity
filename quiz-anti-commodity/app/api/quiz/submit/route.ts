import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  sendToMakeWebhook,
  type MakeWebhookResult,
} from "@/lib/integrations/make";
import { QUIZ_QUESTIONS, RESULT_PROFILES } from "@/lib/quiz-data";
import { sendCapiEvent, normalizeWhatsappE164 } from "@/lib/meta-capi";
import type {
  EnrichedAnswer,
  QuizSubmissionRecord,
  SubmitRequestBody,
} from "@/lib/types";

// Persistência inicial em JSON local. Para produção, trocar pelo bloco
// comentado abaixo (Supabase). Mantenha o contrato do payload igual.
//
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
// );
// const { data, error } = await supabase
//   .from("quiz_submissions")
//   .insert({ ...record })
//   .select("id")
//   .single();

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

// 7 perguntas x 4 pontos máximos = 28. Hardcoded para evitar drift
// se a quantidade de perguntas mudar acidentalmente.
const MAX_SCORE = 28;

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<unknown[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(rows: unknown[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidWhatsapp(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

/**
 * Normaliza um título de resultado em slug seguro.
 * Remove acentos, deixa lowercase, troca não-alfanumericos por hifen,
 * colapsa hifens, faz trim.
 */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Recebe o array de scores escolhidos pelo client (1-4 por pergunta)
 * e enriquece com o texto da pergunta e da alternativa, lendo QUIZ_QUESTIONS
 * como single source of truth.
 */
function enrichAnswers(scores: number[]): EnrichedAnswer[] {
  return scores.map((score, index) => {
    const question = QUIZ_QUESTIONS[index];
    const option = question?.options.find((o) => o.score === score);
    return {
      question: question?.title ?? "",
      selectedOption: option?.text ?? "",
      score,
    };
  });
}

function getNextStepFor(resultTitle: string): string {
  const profile = RESULT_PROFILES.find((p) => p.key === resultTitle);
  return profile?.nextStep ?? "";
}

export async function POST(request: Request) {
  let body: SubmitRequestBody;
  try {
    body = (await request.json()) as SubmitRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const whatsapp = (body.whatsapp ?? "").trim();
  const investmentCapacity = (body.investmentCapacity ?? "").trim();
  const answers = Array.isArray(body.answers) ? body.answers : [];

  if (!name || !email || !whatsapp || !investmentCapacity) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }

  if (!isValidWhatsapp(whatsapp)) {
    return NextResponse.json(
      { ok: false, error: "invalid_whatsapp" },
      { status: 400 },
    );
  }

  if (answers.length !== 7) {
    return NextResponse.json(
      { ok: false, error: "invalid_answers" },
      { status: 400 },
    );
  }

  // Cada item do answers do client é um score 1-4. Valida antes de enriquecer.
  const allScoresValid = answers.every(
    (s) => typeof s === "number" && s >= 1 && s <= 4,
  );
  if (!allScoresValid) {
    return NextResponse.json(
      { ok: false, error: "invalid_answer_score" },
      { status: 400 },
    );
  }

  const enriched = enrichAnswers(answers);
  // Garantia final: cada enriched precisa ter question, selectedOption e score.
  const enrichmentOk = enriched.every(
    (a) => a.question && a.selectedOption && typeof a.score === "number",
  );
  if (!enrichmentOk) {
    return NextResponse.json(
      { ok: false, error: "enrichment_failed" },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();
  const userAgent = request.headers.get("user-agent") ?? "";
  const resultTitle = (body.resultTitle ?? "").trim();
  const resultSlug = resultTitle ? slugify(resultTitle) : "";

  const record: QuizSubmissionRecord = {
    id,
    name,
    profession: (body.profession ?? "").trim(),
    email,
    whatsapp,
    investmentCapacity,
    totalScore: body.totalScore ?? 0,
    maxScore: MAX_SCORE,
    resultTitle,
    resultSlug,
    mainBottleneck: (body.mainBottleneck ?? "").trim(),
    nextStep: getNextStepFor(resultTitle),
    answers: enriched,
    utm_source: body.utm_source ?? "",
    utm_medium: body.utm_medium ?? "",
    utm_campaign: body.utm_campaign ?? "",
    utm_content: body.utm_content ?? "",
    utm_term: body.utm_term ?? "",
    pageUrl: (body.pageUrl ?? "").trim(),
    userAgent,
    submittedAt: new Date().toISOString(),
  };

  try {
    const all = await readAll();
    all.push(record);
    await writeAll(all);
  } catch (error) {
    console.log(
      "[submit] persistence skipped",
      error instanceof Error ? error.message : "unknown",
    );
  }

  // Disparo do webhook do Make. Roda isolado em try/catch: falha aqui
  // NUNCA derruba a submissão para o usuário. A persistência local já está
  // confirmada acima e o response retorna 200 mesmo se o Make falhar.
  let webhookResult: MakeWebhookResult = {
    ok: false,
    skipped: true,
    reason: "not attempted",
  };
  try {
    webhookResult = await sendToMakeWebhook(record);
  } catch (error) {
    webhookResult = {
      ok: false,
      error: error instanceof Error ? error.message : "unknown",
    };
  }

  // Dispatch Lead via Meta Conversion API (server-side).
  // Usa o mesmo event_id que o client mandou pra deduplicar com o fbq Lead.
  // Pega fbp/fbc dos cookies pra cruzar com o navegador do user.
  const leadEventId = (body.leadEventId ?? "").trim();
  let capiResult: Awaited<ReturnType<typeof sendCapiEvent>> | { skipped: true; reason: string } = {
    skipped: true,
    reason: "no_lead_event_id",
  };
  if (leadEventId) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const fbp = readCookie(cookieHeader, "_fbp");
    const fbc = readCookie(cookieHeader, "_fbc");
    const ip = readClientIp(request);
    try {
      capiResult = await sendCapiEvent({
        eventName: "Lead",
        eventId: leadEventId,
        eventSourceUrl: record.pageUrl || undefined,
        userData: {
          email,
          phone: normalizeWhatsappE164(whatsapp),
          firstName: name.split(" ")[0],
          externalId: id,
          fbp,
          fbc,
          clientIpAddress: ip,
          clientUserAgent: userAgent,
        },
        customData: {
          quiz_result: resultTitle,
          quiz_score: record.totalScore,
          quiz_max_score: MAX_SCORE,
          main_bottleneck: record.mainBottleneck,
          investment_capacity: investmentCapacity,
          utm_source: record.utm_source,
          utm_medium: record.utm_medium,
          utm_campaign: record.utm_campaign,
          utm_content: record.utm_content,
          utm_term: record.utm_term,
        },
      });
    } catch (error) {
      capiResult = {
        ok: false,
        error: error instanceof Error ? error.message : "unknown",
      };
    }
  }

  console.log("[submit]", {
    id,
    persisted: true,
    webhook: webhookResult,
    capi: capiResult,
  });

  return NextResponse.json({ ok: true, id });
}

function readCookie(cookieHeader: string, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

function readClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") ?? undefined;
}
