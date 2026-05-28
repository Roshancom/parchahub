import { Request, Response } from 'express';

import { SUCCESS } from '../constants/result.constants.js';
import {
  deleteUser,
  getPamphletsByuser_id,
  getUsers,
  getUsersById,
  updateUser,
} from '../services/users.services.js';
import { ForbiddenException } from '../types/errors.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { errorSuccessMessage, successResponse } from '../utils/helpers.js';

export const getUsersHandler = asyncHandler(
  async (_: Request, res: Response) => {
    const result = await getUsers();
    successResponse(res, 200, result, 'User retrieved successfully.');
  },
);

export const getUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await getUsersById(Number(id));
    successResponse(res, 200, result, 'User retrieved successfully.');
  },
);

export const updateUserByIdHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email } = req.body;
    await updateUser(Number(id), { name, email });
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
    await deleteUser(Number(id));
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
