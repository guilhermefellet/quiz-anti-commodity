export function trackEvent(event: string, payload?: Record<string, unknown>) {
  // TODO: conectar Meta Pixel / Google Ads / GTM aqui.
  // Ponto único de instrumentação para todos os eventos do quiz.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[track]", event, payload ?? {});
  }
}
