const OpenAI = require("openai");
const Match = require("../models/Match");
const Team = require("../models/Team");
const User = require("../models/User");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// -------------- AI MAIN HANDLER ------------------
exports.askAI = async (req, res) => {
  try {
    const user = req.user;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // 1. Fetch user's favorites (context for assistant)
    const favoriteTeams = [
      ...user.publicFavorites,
      ...user.privateFavorites,
      ...user.veryFavoriteTeams
    ];

    // 2. Prepare prompt with system context
    const systemPrompt = `
You are GameDay AI, an assistant that ONLY gives answers about:
- football clubs
- leagues
- matches
- schedules
- stats
- where to watch the match
Do NOT answer anything outside football/sports.

User's favorite teams: ${JSON.stringify(favoriteTeams)}
User timezone: ${user.timezone}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.json({ answer: reply });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI request failed" });
  }
};
