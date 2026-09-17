// Vercel auto-detects any file under /api as a serverless function —
// no extra config needed. This one endpoint does one job: take the
// quiz result + answers, ask Gemini for a personalized rewrite, and
// hand back plain text. The API key never leaves the server.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { winnerName, answers } = req.body || {};
  if (!winnerName || !Array.isArray(answers) || answers.length === 0) {
    res.status(400).json({ error: "Missing winnerName or answers" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Set this in Vercel: Project Settings -> Environment Variables.
    res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });
    return;
  }

  // Override this in Vercel's env vars (GEMINI_MODEL) if Google renames
  // or deprecates the model below without touching this file.
  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

  const picks = answers.join("; ");
  const prompt =
    "You are writing a short style-quiz result for Sister Jane, a London fashion brand " +
    "known for vintage-inspired, whimsical, romantic, storytelling copy (\"never the quiet one\", " +
    "ditsy florals, Peter Pan collars, a new capsule collection every six weeks).\n\n" +
    "A shopper just matched the archetype \"" + winnerName + "\". Her six answers, in order, were: " + picks + ".\n\n" +
    "Write 2-3 warm, playful sentences in Sister Jane's voice that feel personal to THIS shopper " +
    "by referencing at least one specific detail from her answers, not just the archetype in general. " +
    "Keep it under 55 words. Plain text only, no quotation marks, no headings, don't mention AI.";

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      model + ":generateContent?key=" + apiKey;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      res.status(502).json({ error: "Gemini request failed", detail });
      return;
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      res.status(502).json({ error: "No text in Gemini response" });
      return;
    }

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "Unexpected error", detail: String(err) });
  }
}
