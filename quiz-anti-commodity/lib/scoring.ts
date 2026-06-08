import { QUIZ_QUESTIONS, RESULT_PROFILES, ResultProfile } from "./quiz-data";

export function computeScore(answers: number[]): number {
  return answers.reduce((sum, value) => sum + (value || 0), 0);
}

export function getResultByScore(score: number): ResultProfile {
  const found = RESULT_PROFILES.find(
    (profile) => score >= profile.range[0] && score <= profile.range[1],
  );
  return found ?? RESULT_PROFILES[0];
}

export function getMainBottleneck(answers: number[]): {
  questionId: number;
  label: string;
} {
  let lowestScore = Infinity;
  let lowestIndex = 0;

  for (let i = 0; i < answers.length; i += 1) {
    const value = answers[i];
    if (typeof value === "number" && value < lowestScore) {
      lowestScore = value;
      lowestIndex = i;
    }
  }

  const question = QUIZ_QUESTIONS[lowestIndex];
  return {
    questionId: question?.id ?? 1,
    label: question?.bottleneckLabel ?? "Sistema de crescimento",
  };
}
