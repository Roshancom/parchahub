import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandlerMiddleware } from '../middleware/errorHandlerMiddleware.js';
import rootRouter from '../routes/rootRoutes.js';
import { NotFoundException } from '../types/errors.js';
import db from '../db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Middleware
app.use(express.json({ limit: '16kb' }));

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
  });
});

/**
 * Health check endpoint — verifies DB connectivity
 */
app.get('/api/health', async (_req, res) => {
  try {
    await db.execute('SELECT 1');
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/api', rootRouter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req, _, next) => {
  next(
    new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`),
  );
});

/**
 * Global error handling middleware
 */
app.use(errorHandlerMiddleware);

export default app;
