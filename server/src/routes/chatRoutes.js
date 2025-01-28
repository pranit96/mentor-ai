// chatRoutes.js (simplified)
import express from 'express';
import { chatHandler } from '../controllers/chatController.js';
import { validateChatInput } from '../utils/validation.js';

const router = express.Router();

router.post('/chat', 
  (req, res, next) => {
    if (!validateChatInput(req.body.message)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    next();
  },
  chatHandler
);

// Test endpoint
router.get('/test-groq', async (req, res) => {
    try {
      const testResponse = await groq.chat.completions.create({
        messages: [{ role: "user", content: "Say 'Hello World'" }],
        model: "mixtral-8x7b-32768"
      });
      
      res.json({
        success: true,
        response: testResponse.choices[0].message.content
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

export default router;