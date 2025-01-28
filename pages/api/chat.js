import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "mixtral-8x7b-32768"
    });

    res.status(200).json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
}