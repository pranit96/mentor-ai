import dotenv from 'dotenv';

dotenv.config();

// Add validation check
if (!process.env.GROQ_API_KEY) {
  throw new Error('❌ GROQ_API_KEY missing in .env file');
}

export const env = {
  PORT: process.env.PORT || 3000,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL
};