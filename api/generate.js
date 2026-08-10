export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, level, numQuestions } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing GROQ_API_KEY environment variable.' });
  }

  const promptText = `
  Generate exactly ${numQuestions} multiple-choice interview questions for a ${level} ${role}.
  Respond ONLY with a raw JSON array containing ${numQuestions} objects. Do NOT wrap in markdown backticks or add any extra prose.
  
  JSON Format:
  [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief 1-sentence explanation why this answer is correct."
    }
  ]
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error?.message || 'Failed to fetch from Groq' });
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const cleanJson = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();

    return res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}