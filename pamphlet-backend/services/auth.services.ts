import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../repository/auth.repository.js';
import { UnAuthorizedException } from '../types/errors.js';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const normalizedEmail = email.toLowerCase().trim();
  const trimmedName = name.trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser.length) {
    throw new UnAuthorizedException('Email already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createUser(trimmedName, normalizedEmail, hashedPassword);
};

export const loginUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const users = await findUserByEmail(normalizedEmail);
  const user = users?.[0];

  const isPasswordValid = await bcrypt.compare(password, user?.password || '');

  if (!user || !isPasswordValid) {
    throw new UnAuthorizedException('Invalid email or password.');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not configured.');
  }

  const expiresInSeconds = parseInt(process.env.JWT_EXPIRE || '604800', 10);
  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: isNaN(expiresInSeconds) ? 604800 : expiresInSeconds },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
