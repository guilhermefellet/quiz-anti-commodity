# Termômetro Anti-Commodity

Quiz de aquisição em Next.js 14 (App Router) para o ecossistema Consultor 10K (Anna Mattei). Mede o nível de "commodity" do consultor financeiro em 7 perguntas e entrega um diagnóstico em 4 perfis, com handoff para WhatsApp.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- lucide-react para ícones minimalistas
- Persistência inicial em JSON local (`data/submissions.json`), com ponto de troca por Supabase comentado no código

## Como rodar local

Pré-requisitos: Node.js 18.18+ (recomendado 20+) e npm 9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000` no navegador (de preferência no DevTools em modo mobile).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=5521920122976
MAKE_WEBHOOK_URL=
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: usado para montar o link `https://wa.me/...` na tela de resultado.
- `MAKE_WEBHOOK_URL`: server-side. Se vazio, o quiz continua funcionando e só persiste em `data/submissions.json`. Detalhes em `## Integrações`.

## UTMs

Os parâmetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` são lidos da URL no primeiro load e persistidos em `localStorage`. Eles sobrevivem durante todo o fluxo e são enviados no payload do `POST /api/quiz/submit`.

Exemplo: `https://seu-dominio.com/?utm_source=meta&utm_medium=cpc&utm_campaign=anti-commodity&utm_content=criativo-01&utm_term=consultor-financeiro`

## API

`POST /api/quiz/submit` recebe o payload abaixo:

```json
{
  "name": "João",
  "profession": "Consultor financeiro",
  "email": "joao@email.com",
  "whatsapp": "21999999999",
  "answers": [1, 2, 3, 2, 1, 2, 3],
  "score": 14,
  "result": "Especialista Genérico",
  "mainBottleneck": "Presença digital com autoridade",
  "utmSource": "meta",
  "utmMedium": "cpc",
  "utmCampaign": "anti-commodity",
  "utmContent": "criativo-01",
  "utmTerm": "consultor-financeiro"
}
```

A rota valida nome, email, WhatsApp (10 ou 11 dígitos) e tamanho do array de respostas (7), grava `userAgent` e `createdAt` server-side e responde com `{ ok: true, id }`.

## Integrações

### Persistência local (sempre ativa)

Toda submissão é gravada em `data/submissions.json` antes de qualquer integração externa. Esse JSON é a fonte de verdade em desenvolvimento. Na Vercel o filesystem é efêmero, então em produção a fonte de verdade dos leads é o destino para onde o Make manda o payload (Sheets, Kommo, e-mail), não o arquivo local.

### Make webhook (ativa agora)

1. Crie um cenário no Make com o trigger "Webhooks > Custom webhook" e copie a URL gerada.
2. Cole a URL em `MAKE_WEBHOOK_URL` no `.env.local` (local) ou nas env vars do projeto na Vercel.
3. No cenário, encadeie as ações desejadas, por exemplo "Google Sheets > Add a row", "Gmail > Send", "Kommo > Create lead".

Se `MAKE_WEBHOOK_URL` ficar vazio, o quiz continua funcionando normalmente: salva localmente, loga `[make] skipped MAKE_WEBHOOK_URL not set` e devolve `{ ok: true, id }` pro client. A falha do Make também não derruba a submissão: o disparo roda em try/catch isolado com timeout de 5s.

Payload enviado (POST JSON):

```json
{
  "id": "uuid-gerado-server-side",
  "name": "João",
  "email": "joao@email.com",
  "whatsapp": "21999999999",
  "profession": "Consultor financeiro",
  "answers": [1, 2, 3, 2, 1, 2, 3],
  "score": 14,
  "result": "Especialista Genérico",
  "mainBottleneck": "Presença digital com autoridade",
  "utmSource": "meta",
  "utmMedium": "cpc",
  "utmCampaign": "anti-commodity",
  "utmContent": "criativo-01",
  "utmTerm": "consultor-financeiro",
  "userAgent": "Mozilla/5.0 ...",
  "createdAt": "2026-06-07T19:00:00.000Z"
}
```

### Roadmap de integrações

- **Etapa 1 (ativa)**: Make webhook. Hub central que distribui o lead para os destinos finais.
- **Etapa 2 (preparada, não ativa)**: Google Sheets direto via service account. Stub em `lib/integrations/google-sheets.ts`. Só será ativada se o time decidir não depender do Make.
- **Etapa 3 (preparada, não ativa)**: Kommo CRM direto via API. Stub em `lib/integrations/kommo.ts`. Hoje a entrada no Kommo deve sair do próprio cenário do Make.

Os stubs retornam `{ ok: false, skipped: true, reason: '...' }` e ainda não são chamados pelo `route.ts`.

## Deploy na Vercel

1. Crie um repositório no GitHub e suba o projeto.
2. No painel da Vercel, importe o repositório.
3. Em "Environment Variables", adicione:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER=5521920122976`
   - `MAKE_WEBHOOK_URL=<URL do cenário do Make>` (deixar vazio se ainda não tiver o cenário pronto)
4. Faça o deploy.

Observação importante: o filesystem da Vercel é efêmero. A persistência em `data/submissions.json` serve só para desenvolvimento. Em produção, a fonte de verdade dos leads é o destino final configurado no Make (Sheets, Kommo, e-mail). Se quiser uma cópia server-side completa no banco, ative o bloco do Supabase nas instruções abaixo.

## Trocando JSON local por Supabase

Em `app/api/quiz/submit/route.ts`, há um bloco comentado com o pseudocódigo. Para ativar:

1. `npm install @supabase/supabase-js`
2. Crie a tabela `quiz_submissions` no Supabase com as colunas equivalentes ao record (id uuid, name text, email text, whatsapp text, answers jsonb, score int, result text, main_bottleneck text, utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text, user_agent text, created_at timestamptz default now()).
3. Adicione `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` nas variáveis de ambiente da Vercel (server-side only, nunca expor para o client).
4. Substitua a leitura/escrita do JSON pelo `supabase.from('quiz_submissions').insert(record)`.
5. Mantenha as validações de entrada como estão.

## Eventos de tracking

Função central em `lib/analytics.ts` (`trackEvent`). Hoje só faz `console.log`. Conecte Meta Pixel, Google Ads e GTM aqui.

Eventos disparados:

- `quiz_started`, clique no botão da tela de boas-vindas
- `lead_started`, submit da captura inicial (nome + profissão)
- `quiz_completed`, última pergunta respondida
- `result_viewed`, entrada na tela de resultado após captura final
- `whatsapp_clicked`, clique no CTA de WhatsApp

## Estrutura

```
app/
  layout.tsx
  page.tsx
  globals.css
  api/quiz/submit/route.ts
components/
  WelcomeScreen.tsx
  InitialCapture.tsx
  QuestionsFlow.tsx
  FinalCapture.tsx
  ResultScreen.tsx
  ProgressBar.tsx
  BrandHeader.tsx
  Footer.tsx
lib/
  quiz-data.ts
  scoring.ts
  analytics.ts
  utm.ts
  whatsapp.ts
data/
  (submissions.json é criado on-demand)
```

## Identidade visual

- Fundo: `#FFFFFF`
- Primária: `#051933`
- Destaque: `#FF6600`
- Secundária: `#1F2937`

Cards `rounded-2xl` (16px), sombra suave, botões altos (`h-12`), tipografia do sistema, animações sutis de fade.
