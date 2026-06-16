import { Request, Response } from 'express';

import { SUCCESS } from '../constants/result.constants.js';
import {
  deleteUser,
  getPamphletsByuser_id,
  getUsers,
  getUsersById,
  updateUser,
} from '../services/users.services.js';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../types/errors.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { errorSuccessMessage, successResponse } from '../utils/helpers.js';

export const getUsersHandler = asyncHandler(
  async (_: Request, res: Response) => {
    const result = await getUsers();
    successResponse(res, 200, result, 'Users retrieved successfully.');
  },
);

export const getUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = Number(id);

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    const result = await getUsersById(userId);

    if (!result || result.length === 0) {
      throw new NotFoundException('User not found.');
    }

    successResponse(res, 200, result[0], 'User retrieved successfully.');
  },
);

export const updateUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = Number(id);
    const requestingUserId = req.user?.id;

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    // Only allow users to update their own profile
    if (userId !== requestingUserId) {
      throw new ForbiddenException(
        'You are not authorized to update this user.',
      );
    }

    const existingUser = await getUsersById(userId);
    if (!existingUser || existingUser.length === 0) {
      throw new NotFoundException('User not found.');
    }

    const { name, email } = req.body;
    await updateUser(userId, {
      name: name?.trim(),
      email: email?.toLowerCase().trim(),
    });
    errorSuccessMessage({
      res,
      status: 200,
      type: SUCCESS,
      message: 'User updated successfully.',
    });
  },
);

export const deleteUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = Number(id);
    const requestingUserId = req.user?.id;

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    // Only allow users to delete their own profile
    if (userId !== requestingUserId) {
      throw new ForbiddenException(
        'You are not authorized to delete this user.',
      );
    }

    const existingUser = await getUsersById(userId);
    if (!existingUser || existingUser.length === 0) {
      throw new NotFoundException('User not found.');
    }

    await deleteUser(userId);
    errorSuccessMessage({
      res,
      status: 200,
      type: SUCCESS,
      message: 'User deleted successfully.',
    });
  },
);

// Bug Fix #5: verify the requesting user owns the pamphlets they're trying to view
export const getPamphletsByuser_idHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;
    const requestingUserId = req.user?.id;

    if (Number(user_id) !== requestingUserId) {
      throw new ForbiddenException(
        'You are not authorized to view these pamphlets.',
      );
    }

    const result = await getPamphletsByuser_id(Number(user_id));
    successResponse(res, 200, result, 'Pamphlets retrieved successfully.');
  },
);

export const getProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    const result = await getUsersById(Number(userId));

    successResponse(res, 200, result, 'Profile Data successfully retrieved.');
  },
);
