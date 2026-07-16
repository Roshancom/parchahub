import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '../repository/auth.repository.js';
import sendMail from '../utils/sendMail.js';
import { updateUserPasswordById } from '../repository/users.repository.js';
import { UnprocessableEntityException } from '../types/errors.js';

export const resetPassword = async (email: string) => {
  const user = await findUserByEmail(email);

  // Always return a success message regardless of whether the email exists
  // This prevents email enumeration attacks
  if (!user || user.length === 0 || !user[0]?.id) {
    return { message: 'If account exists, reset link sent to email' };
  }

  // generate token
  const token = jwt.sign(
    {
      id: user[0].id,
      email: user[0].email,
    },
    process.env.JWT_RESET_SECRET || '',
    {
      expiresIn: '15m',
    },
  );

  const resetLink = `${process.env.CLIENT_URL}/forgot-password?token=${token}`;

  const html = `
      <h2>Password Reset</h2>
      <p>Click the button below to reset your password</p>

      <a href="${resetLink}">
        <button
          style="
            padding:10px 20px;
            background:black;
            color:white;
            border:none;
            cursor:pointer;
          "
        >
          Reset Password
        </button>
      </a>

      <p>This link expires in 15 minutes.</p>
    `;

  return await sendMail(email, 'Reset Your Password', html);
};

export const updatePassword = async (token: string, password: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_SECRET || '',
    ) as JwtPayload;

    const hashedPassword = await bcrypt.hash(password, 10);

    await updateUserPasswordById(decoded.id, hashedPassword);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnprocessableEntityException(
        'Reset link has expired. Please request a new one.',
      );
    }
    throw new UnprocessableEntityException('Invalid or malformed reset token.');
  }
};
