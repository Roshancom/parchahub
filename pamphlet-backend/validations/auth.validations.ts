import z from 'zod';

// Strip HTML/script tags from user-provided strings to prevent XSS
const stripHtml = (value: string): string =>
  value.replace(/<[^>]*>/g, '').trim();

const sanitizedString = (minLength: number = 1, maxLength: number = 255) =>
  z
    .string()
    .trim()
    .min(minLength, `Must be at least ${minLength} character(s)`)
    .max(maxLength, `Must not exceed ${maxLength} characters`)
    .transform((v) => stripHtml(v));

export const registerSchema = z.object({
  name: sanitizedString(1, 100),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255)
    .transform((v) => v.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((v) => v.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
