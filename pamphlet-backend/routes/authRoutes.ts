import express from 'express';

import { login, register } from '../controllers/authController.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import {
  loginSchema,
  registerSchema,
} from '../validations/auth.validations.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  authRateLimiter,
  validationMiddleware(registerSchema),
  register,
);

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post(
  '/login',
  authRateLimiter,
  validationMiddleware(loginSchema),
  login,
);

export default router;
