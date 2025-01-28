// src/middlewares/security.js (fixed)
import helmet from 'helmet'; // Add this missing import
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const applySecurityMiddleware = (app) => {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"]
      }
    }
  }));
  
  app.use(cors({ origin: env.CLIENT_URL }));
  
  app.use(rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW,
    max: env.RATE_LIMIT_MAX
  }));
};