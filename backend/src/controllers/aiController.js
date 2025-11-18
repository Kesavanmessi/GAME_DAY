// backend/src/controllers/aiController.js
const OpenAI = require("openai");
const aiService = require("../services/aiService");
const Match = require("../models/Match");
const Team = require("../models/Team");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper: build context and ask OpenAI for a friendly answer
async function askOpenAI(systemContext, userQuestion) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemContext },
      { role: "user", content: userQuestion }
    ],
    max_tokens: 400
  });

  return completion.choices[0].message.content;
}

exports.askAI = async (req, res) => {
  try {
    const user = req.user;
    const { question, countryCode } = req.body; // optional country for where-to-watch

    if (!question) return res.status(400).json({ message: "Question is required" });

    // 1) Try to detect team name in question
    // naive approach: check all teams that appear as words (improves later)
    // We'll try by scanning for team names using aiService.findTeamByName
    // Find longest matching token sequence — start with splitting question into tokens
    // For simplicity, try matching by trying every word/phrase (descending length)
    const words = question.replace(/[?.,!]/g, "").split(/\s+/);
    let detectedTeam = null;

    // try phrases length 3 -> 1
    for (let len = 5; len >= 1 && !detectedTeam; len--) {
      for (let i = 0; i + len <= words.length; i++) {
        const phrase = words.slice(i, i + len).join(" ");
        const team = await aiService.findTeamByName(phrase);
        if (team) {
          detectedTeam = team;
          break;
        }
      }
    }

    // 2) Branch based on probable intent: next match / last 5 / where to watch / today favorites
    const lc = question.toLowerCase();

    if (lc.includes("next") && detectedTeam) {
      const nextMatch = await aiService.getNextMatchForTeam(detectedTeam.teamId);
      const systemContext = `You are GameDay assistant. Use the exact data provided. Next match data: ${JSON.stringify(nextMatch || {})}. Answer concisely with date/time in user's timezone: ${user.timezone}.`;
      const userPrompt = `User asked: "${question}". Provide a short helpful answer using the match data provided.`;
      const answer = await askOpenAI(systemContext, userPrompt);
      return res.json({ answer, data: { team: detectedTeam, nextMatch } });
    }

    if ((lc.includes("last") || lc.includes("recent") || lc.includes("form")) && detectedTeam) {
      const lastMatches = await aiService.getLastMatchesForTeam(detectedTeam.teamId, 5);
      const systemContext = `You are GameDay assistant. Use the exact match array provided. Provide concise last-5 summary. Data: ${JSON.stringify(lastMatches || [])}`;
      const userPrompt = `User asked: "${question}". Summarize the last ${lastMatches.length} matches.`;
      const answer = await askOpenAI(systemContext, userPrompt);
      return res.json({ answer, data: { team: detectedTeam, lastMatches } });
    }

    if (lc.includes("where") && lc.includes("watch")) {
      // If team detected, find next match then suggest provider
      if (!detectedTeam) {
        const systemContext = `You are GameDay assistant and user asked about where to watch. You must ask for team if not provided.`;
        const reply = await askOpenAI(systemContext, `User asked: "${question}". Ask a clarifying question: which team (and country) do they mean?`);
        return res.json({ answer: reply });
      }
      // get next match
      const nextMatch = await aiService.getNextMatchForTeam(detectedTeam.teamId);
      const providers = aiService.getWatchProvidersByCountry(countryCode || (user.location || "").split(",")[0] || "");
      const systemContext = `You are GameDay assistant. Use match and provider data to tell user where to watch. Match: ${JSON.stringify(nextMatch || {})}. Providers: ${JSON.stringify(providers)}`;
      const userPrompt = `User asked: "${question}" for country: ${countryCode || user.location || "unknown"}. Provide where-to-watch info with provider names.`;
      const answer = await askOpenAI(systemContext, userPrompt);
      return res.json({ answer, data: { team: detectedTeam, nextMatch, providers } });
    }

    if (lc.includes("my favorites") || lc.includes("my teams") || lc.includes("my team")) {
      const matches = await aiService.getMatchesForUserFavorites(user._id, 7);
      const systemContext = `You are GameDay assistant. Use the exact matches provided. Provide a short summary: how many matches this week and which teams.`;
      const userPrompt = `User asked: "${question}". Use the matches for this user: ${JSON.stringify(matches)}`;
      const answer = await askOpenAI(systemContext, userPrompt);
      return res.json({ answer, data: { matches } });
    }

    // Fallback: pass the question + favorites context to OpenAI but limit scope
    const favoriteTeams = [
      ...user.publicFavorites,
      ...user.privateFavorites,
      ...user.veryFavoriteTeams
    ];
    const systemContext = `You are GameDay assistant. You only answer about football clubs, leagues, matches, schedules, stats, and where to watch. User favorites: ${JSON.stringify(favoriteTeams)}. User timezone: ${user.timezone}.`;
    const answer = await askOpenAI(systemContext, question);

    return res.json({ answer });
  } catch (err) {
    console.error("AI Controller error:", err);
    return res.status(500).json({ message: "AI processing failed" });
  }
};
