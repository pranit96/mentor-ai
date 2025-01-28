import { Groq } from 'groq-sdk';
import { env } from '../config/env.js';

// Initialize Groq client PROPERLY
const groqClient = new Groq({
  apiKey: env.GROQ_API_KEY
});

export const chatHandler = async (req, res) => {
  try {
    const userMessage = req.body.message.substring(0, 500);

    // Use the initialized client
    const completion = await groqClient.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful mentor..." },
        { role: "user", content: userMessage }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};