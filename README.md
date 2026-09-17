# Which Sister Jane Story Are You? 🌷

An interactive style quiz concept for [Sister Jane](https://www.sisterjane.com), a
London fashion brand — built as a portfolio piece exploring AI-personalized
customer experiences for fashion e-commerce.

Answer six whimsical questions and get matched to one of four style
archetypes. The result includes a short story rewritten live by Gemini,
so it references your specific answers rather than reading like a
generic template.

**Not affiliated with or endorsed by Sister Jane.** This is a concept
demo, not a live production feature.

## How it works

1. Six multiple-choice questions, each option tagged to one of four
   archetypes (`maven`, `romantic`, `velvet`, `dreamer`).
2. A simple tally decides which archetype the answers point to most —
   this part is deterministic and always works, no external service
   involved.
3. That result, plus the shopper's specific answer text, gets sent to
   a small serverless function, which asks Gemini to rewrite the result
   copy so it references a real detail from their answers.
4. If that request fails for any reason (missing key, rate limit,
   network issue), the page silently keeps the static — still
   perfectly good — result text instead of breaking. The AI layer is
   an enhancement, never a dependency.

## Tech stack

| Layer | What's used |
|---|---|
| Frontend | Plain HTML/CSS/JavaScript — no framework, no build step |
| Backend | One Vercel serverless function (Node.js, ES modules) |
| AI | Google Gemini API |
| Hosting | Vercel |

## Project structure

```
.
├── index.html          the quiz — markup, styling, and client logic
├── api/
│   └── personalize.js  serverless function that calls Gemini
├── package.json         marks this as an ES module project
├── .env.example          template for the one required secret
└── .gitignore
```

## Running it locally

You'll need [Node.js](https://nodejs.org) 18+ and the Vercel CLI.

```bash
npm i -g vercel
vercel login
```

Copy the env template and add a real key (get one free at
[Google AI Studio](https://aistudio.google.com/apikey)):

```bash
cp .env.example .env.local
# then edit .env.local and paste your key in place of your_key_here
```

Start the dev server:

```bash
vercel dev
```

Open the URL it prints (usually `http://localhost:3000`) and run
through the quiz.

> A plain double-click on `index.html`, or a Live Server extension,
> will show the quiz fine but can't run `api/personalize.js` — you'll
> just see the static fallback text instead of the live version. Use
> `vercel dev` if you want to test the AI part.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Before deploying, go to **Project Settings → Environment
   Variables** and add `GEMINI_API_KEY` with your key.
4. Deploy. Vercel serves `index.html` as the site and automatically
   turns `api/personalize.js` into a live endpoint at
   `/api/personalize` — no extra config needed.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Authenticates requests to the Gemini API |
| `GEMINI_MODEL` | No | Overrides the model name (default: `gemini-3.1-flash-lite`) without touching code |

Google renames and retires Gemini model IDs fairly often. If requests
to `/api/personalize` start failing after working before, check the
current model list at
[ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)
and set `GEMINI_MODEL` accordingly.
