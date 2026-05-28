import { Request, Response } from 'express';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '../types/errors.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { successResponse } from '../utils/helpers.js';
import {
  resetPassword,
  updatePassword,
} from '../services/password.services.js';

export const resetHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      throw new NotFoundException('Valid email is required to send reset link');
    }

    const response = await resetPassword(email);

    successResponse(
      res,
      200,
      response,
      'If account exists, reset link sent to email',
    );
  },
);

export const passwordHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, password, confirmPassword } = req.body;

    // console.log(password, confirmPassword);

    if (password !== confirmPassword) {
      throw new UnprocessableEntityException(
        'Password and confirm password do not match',
      );
    }

    const response = await updatePassword(token, password);

    successResponse(res, 200, response, 'Password reset successfully');
  },
);
