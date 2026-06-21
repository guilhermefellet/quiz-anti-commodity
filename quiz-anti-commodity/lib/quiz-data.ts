export type QuizOption = {
  text: string;
  score: 1 | 2 | 3 | 4;
};

export type QuizQuestion = {
  id: number;
  title: string;
  bottleneckLabel: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: "Como você conquista clientes hoje?",
    bottleneckLabel: "Dependência de indicação",
    options: [
      {
        text: "Dependo quase totalmente de indicação e não tenho previsibilidade",
        score: 1,
      },
      {
        text: "Tenho algumas indicações e tento postar quando dá, mas sem processo claro",
        score: 2,
      },
      {
        text: "Tenho presença digital e algumas conversas vindo dela, mas ainda é irregular",
        score: 3,
      },
      {
        text: "Tenho um processo claro para gerar leads, qualificar e levar para conversa comercial",
        score: 4,
      },
    ],
  },
  {
    id: 2,
    title:
      "Quando alguém olha seu perfil ou sua comunicação, fica claro para quem você é a melhor escolha?",
    bottleneckLabel: "Nicho e clareza de público",
    options: [
      {
        text: "Não. Eu ainda falo de finanças de forma ampla para públicos diferentes",
        score: 1,
      },
      {
        text: "Mais ou menos. Tenho uma ideia de público, mas ainda comunico de forma genérica",
        score: 2,
      },
      {
        text: "Sim, tenho um público mais definido, mas minha mensagem ainda poderia ser mais específica",
        score: 3,
      },
      {
        text: "Sim. Fica claro quem eu ajudo, qual problema resolvo e por que isso importa",
        score: 4,
      },
    ],
  },
  {
    id: 3,
    title: "Como você explica o que vende?",
    bottleneckLabel: "Oferta empacotada",
    options: [
      {
        text: "Explico como consultoria, mentoria ou educação financeira, sem uma oferta muito clara",
        score: 1,
      },
      {
        text: "Tenho uma entrega, mas ainda adapto muito caso a caso e isso confunde a venda",
        score: 2,
      },
      {
        text: "Tenho uma oferta mais estruturada, mas ainda preciso melhorar nome, promessa e escopo",
        score: 3,
      },
      {
        text: "Tenho uma oferta empacotada, com promessa, formato, duração, preço e próximo passo claros",
        score: 4,
      },
    ],
  },
  {
    id: 4,
    title: "O que mais aparece no seu conteúdo ou discurso comercial?",
    bottleneckLabel: "Tese e diferenciação",
    options: [
      {
        text: "Explicações gerais sobre finanças, investimentos, organização ou planejamento",
        score: 1,
      },
      {
        text: "Conteúdo educativo útil, mas parecido com o que outros profissionais também fazem",
        score: 2,
      },
      {
        text: "Uma mistura de conteúdo técnico, bastidores e algumas ideias próprias",
        score: 3,
      },
      {
        text: "Uma tese clara, com ponto de vista próprio, que diferencia minha forma de resolver o problema",
        score: 4,
      },
    ],
  },
  {
    id: 5,
    title: "Qual é sua maior trava com presença digital?",
    bottleneckLabel: "Presença digital com autoridade",
    options: [
      {
        text: "Tenho medo de parecer influencer ou perder credibilidade técnica",
        score: 1,
      },
      {
        text: "Sei que preciso aparecer, mas não sei o que publicar sem ficar genérico",
        score: 2,
      },
      {
        text: "Já publico, mas ainda não conecto bem conteúdo com conversas comerciais",
        score: 3,
      },
      {
        text: "Uso o digital como canal de autoridade e captação, sem depender de exposição vazia",
        score: 4,
      },
    ],
  },
  {
    id: 6,
    title: "O que acontece depois de uma boa conversa com um prospect?",
    bottleneckLabel: "Processo comercial",
    options: [
      {
        text: "Muitas vezes a pessoa some ou fica no \"vou pensar\"",
        score: 1,
      },
      {
        text: "Eu envio proposta, mas não tenho um processo claro de follow-up e fechamento",
        score: 2,
      },
      {
        text: "Tenho um roteiro comercial básico, mas ainda perco oportunidades por falta de método",
        score: 3,
      },
      {
        text: "Tenho processo de qualificação, condução, proposta, objeções e próximo passo definido",
        score: 4,
      },
    ],
  },
  {
    id: 7,
    title:
      "Se você tivesse que crescer nos próximos 60 dias, qual seria seu maior gargalo?",
    bottleneckLabel: "Sistema de crescimento",
    options: [
      {
        text: "Eu nem sei exatamente o que vender e para quem vender",
        score: 1,
      },
      {
        text: "Eu sei o que faço, mas não tenho oferta e comunicação suficientemente claras",
        score: 2,
      },
      {
        text: "Eu tenho oferta e alguma presença, mas falta funil e rotina comercial",
        score: 3,
      },
      {
        text: "Eu tenho os principais ativos, mas preciso organizar tudo em um sistema que rode com consistência",
        score: 4,
      },
    ],
  },
];

export type ResultKey =
  | "Commodity Invisível"
  | "Especialista Genérico"
  | "Autoridade Subaproveitada"
  | "Anti-Commodity em Construção";

export type ResultProfile = {
  key: ResultKey;
  range: [number, number];
  tone: "danger" | "warn" | "info" | "good";
  headline: string;
  description: string;
  practice: string[];
  nextStep: string;
};

export const RESULT_PROFILES: ResultProfile[] = [
  {
    key: "Commodity Invisível",
    range: [7, 12],
    tone: "danger",
    headline:
      "Você sabe o que faz, mas o mercado ainda não enxerga por que escolher você agora.",
    description:
      "Você tem conhecimento, mas ele ainda não está sendo percebido como valor pelo mercado. O risco aqui é simples: se a sua comunicação parece igual à de todo mundo, o prospect não tem motivo claro para escolher você agora.",
    practice: [
      "Você tende a depender de indicação ou sorte organizada",
      "Sua oferta pode parecer ampla ou pouco tangível",
      "Sua comunicação ainda não cria diferença percebida",
    ],
    nextStep:
      "Antes de postar mais ou investir em tráfego, definir um nicho específico dentro do mercado financeiro e empacotar uma oferta que respeite o compliance e gere previsibilidade.",
  },
  {
    key: "Especialista Genérico",
    range: [13, 18],
    tone: "warn",
    headline:
      "Você já aparece, mas ainda pode estar sendo comparado como mais um bom profissional de finanças.",
    description:
      "Você tem competência e talvez alguma presença, mas ainda comunica de um jeito que faz o mercado te comparar com outros consultores. Isso te coloca em uma disputa ruim: preço, indicação, simpatia ou conveniência.",
    practice: [
      "Seu conteúdo pode ser útil, mas pouco proprietário",
      "Seu público ainda pode estar amplo demais",
      "Sua oferta precisa ganhar forma comercial mais clara",
    ],
    nextStep:
      "Construir uma tese de posicionamento própria e empacotar sua entrega num ativo digital que comece a romper o teto do 1 a 1.",
  },
  {
    key: "Autoridade Subaproveitada",
    range: [19, 24],
    tone: "info",
    headline:
      "Você tem sinais de autoridade, mas ainda não transformou isso em sistema previsível.",
    description:
      "Você já tem base técnica e possivelmente alguma presença. O problema é que autoridade sem sistema vira esforço desperdiçado. Você pode estar produzindo, conversando e entregando valor, mas ainda sem transformar isso em reuniões qualificadas e vendas com consistência.",
    practice: [
      "Sua presença pode não estar conectada a um funil claro",
      "Suas conversas podem depender demais da sua improvisação",
      "Sua oferta pode estar boa, mas não suficientemente orientada à conversão",
    ],
    nextStep:
      "Conectar presença, oferta e processo comercial num sistema único que gere conversas qualificadas com previsibilidade, sem depender de indicação.",
  },
  {
    key: "Anti-Commodity em Construção",
    range: [25, 28],
    tone: "good",
    headline:
      "Você já entendeu que conhecimento técnico não basta. Agora precisa transformar diferenciação em sistema.",
    description:
      "Você já está acima da média porque percebe que não basta ser bom tecnicamente. Mas o próximo salto não vem de mais esforço. Vem de sistema.",
    practice: [
      "Você já tem sinais de posicionamento",
      "Sua oferta pode estar próxima de ficar comercialmente forte",
      "O próximo passo é consolidar um processo replicável de captação e conversão",
    ],
    nextStep:
      "Transformar os ativos que você já tem num sistema de recorrência que roda sem depender da sua agenda.",
  },
];
