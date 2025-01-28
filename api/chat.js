import { chatHandler } from '../server/src/controllers/chatController.js';

export default async (req, res) => {
  // Convert Vercel req/res to Express-like format
  const { method, body } = req;
  
  const mockReq = {
    body: method === 'POST' ? JSON.parse(body) : {},
    method
  };

  const mockRes = {
    json: (data) => res.status(200).send(data),
    status: (code) => ({
      json: (data) => res.status(code).send(data)
    })
  };

  await chatHandler(mockReq, mockRes);
};