import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints (login / register)
 * Prevents brute-force attacks by limiting requests per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.',
  },
});
