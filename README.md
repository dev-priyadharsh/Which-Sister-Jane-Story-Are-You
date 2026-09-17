# Which Sister Jane Story Are You?

A concept interactive style quiz, built as a portfolio piece for an
"AI Creative Technologist" job application. Answers feed into a small
Gemini-powered rewrite of the result text, so no two results read
quite the same.

## What's in this folder

```
index.html          the whole quiz — one file, no build step
api/personalize.js   a small serverless function that talks to Gemini
package.json         tells Vercel this project uses ES modules
.env.example          template for the one secret this needs
```

There's nothing to `npm install` — `api/personalize.js` uses the
`fetch` that's already built into Node 18+, which is what Vercel runs.

## 1. Get a Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and
   sign in with a Google account.
2. Create an API key. Copy it somewhere safe — you won't paste it
   into any file in this project, only into Vercel's dashboard (step 4).

## 2. Push this folder to GitHub

If your friend hasn't done this before: create a new repository on
GitHub, then from inside this folder:

```bash
git init
git add .
git commit -m "Sister Jane story quiz"
git branch -M main
git remote add origin <your-new-repo-url>
git push -u origin main
```

## 3. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in.
2. Import the GitHub repo you just pushed.
3. Leave the build settings as Vercel suggests them — this project
   has no build step, so the defaults are fine. Don't deploy yet.

## 4. Add the API key

Before hitting Deploy: go to **Project Settings → Environment
Variables** and add:

| Name | Value |
|---|---|
| `GEMINI_API_KEY` | the key you copied in step 1 |

`GEMINI_MODEL` is optional — only add it if you want to pin a
specific model name (see the note in `.env.example`).

## 5. Deploy

Click **Deploy**. Vercel will serve `index.html` as the site and turn
`api/personalize.js` into a live endpoint at `/api/personalize`
automatically — that's just how Vercel treats anything in an `/api`
folder, no extra config file needed.

## Testing locally before you deploy

Opening `index.html` directly in a browser will run the quiz, but the
"personalize" step will fail quietly (there's no server to answer
`/api/personalize`) — that's expected, it's the same graceful fallback
that keeps the static result text on screen. To test the AI part
locally:

```bash
npm i -g vercel      # one-time
vercel login
vercel dev
```

Then create a `.env.local` (copy `.env.example` and fill in the real
key) — `vercel dev` reads it automatically.

## If Gemini requests start failing after this is deployed

Google renames and retires Gemini model IDs more often than you'd
expect. If `api/personalize.js` starts returning errors, the model
name in `GEMINI_MODEL` (or the default in the code) is the first thing
to check against Google's current model list at
https://ai.google.dev/gemini-api/docs/models — swap in whatever the
current stable Flash model is called.

## A note on what's real here

The quiz logic, questions, and archetypes are entirely self-contained
and always work. The personalized story line is the one part that
depends on an external service (Gemini) and a small amount of spend —
if the API key is missing, invalid, or the request fails for any
reason, the page shows the static (still good) result copy instead of
breaking. That fallback is a deliberate design choice, not a bug — it's
worth pointing out in an interview if this project comes up.
