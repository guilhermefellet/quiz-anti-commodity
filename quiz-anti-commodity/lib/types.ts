/**
 * Tipos centrais do payload do quiz.
 *
 * Fluxo:
 *  1. Client (app/page.tsx) monta SubmitRequestBody e POSTa pra /api/quiz/submit
 *  2. Server (app/api/quiz/submit/route.ts) valida, enriquece e gera QuizSubmissionRecord
 *  3. QuizSubmissionRecord é o que persiste em data/submissions.json E vai pro Make
 */

/**
 * Resposta enriquecida (montada no server a partir do índice + score do client).
 */
export type EnrichedAnswer = {
  question: string;
  selectedOption: string;
  score: number;
};

/**
 * Body que o client envia no POST /api/quiz/submit.
 * answers ainda chega como number[] (cada item é o score 1-4 escolhido).
 * O server enriquece pra EnrichedAnswer[] usando QUIZ_QUESTIONS.
 */
export type SubmitRequestBody = {
  name?: string;
  profession?: string;
  email?: string;
  whatsapp?: string;
  answers?: number[];
  totalScore?: number;
  resultTitle?: string;
  mainBottleneck?: string;
  pageUrl?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

/**
 * Registro completo persistido localmente e enviado ao Make.
 * Fonte única de verdade do payload.
 */
export type QuizSubmissionRecord = {
  id: string;
  name: string;
  profession: string;
  email: string;
  whatsapp: string;
  totalScore: number;
  maxScore: number;
  resultTitle: string;
  resultSlug: string;
  mainBottleneck: string;
  nextStep: string;
  answers: EnrichedAnswer[];
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  pageUrl: string;
  userAgent: string;
  submittedAt: string;
};
