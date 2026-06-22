export function buildWhatsappLink(params: {
  result: string;
  bottleneck: string;
}): string {
  const number =
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    "5521920122976";

  const message = `Oi, Ana. Fiz o Termômetro Anti-Commodity e meu resultado foi: ${params.result}. Meu principal gargalo foi: ${params.bottleneck}. Quero entender qual seria o próximo plano mais indicado para sair da comparação e criar um sistema mais claro de posicionamento, oferta e captação.`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}
