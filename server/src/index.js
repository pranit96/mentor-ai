// index.js (full fix)
import express from 'express';
import { env } from './config/env.js';
import chatRoutes from './routes/chatRoutes.js';
import { applySecurityMiddleware } from './middlewares/security.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Apply security middleware
applySecurityMiddleware(app);

app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Error handling
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});