import { Groq } from 'groq-sdk';
import { env } from '../config/env.js';

class GroqService {
  constructor() {
    this.groq = new Groq({ apiKey: env.GROQ_API_KEY });
  }

  async getCompletion(messages) {
    return this.groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 500
    });
  }
}

export default new GroqService();