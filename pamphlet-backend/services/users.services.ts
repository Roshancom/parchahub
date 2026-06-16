import { UnAuthorizedException } from '../types/errors.js';
import {
  deletePamphletContacts,
  deletePamphletsByUserId,
} from '../repository/pamphlets.repository.js';
import {
  deleteUserById,
  findAllUsers,
  findPamphletsByuser_id,
  findUserById,
  findUserByEmail,
  updateUserById,
} from '../repository/users.repository.js';

export const getUsers = async () => await findAllUsers();

export const getUsersById = async (id: number) => await findUserById(id);

export const updateUser = async (
  id: number,
  data: { name?: string; email?: string },
) => {
  // Check email uniqueness if email is being changed
  if (data.email) {
    const existingUserWithEmail = await findUserByEmail(data.email);
    if (
      existingUserWithEmail.length > 0 &&
      existingUserWithEmail[0].id !== id
    ) {
      throw new UnAuthorizedException('Email already in use by another account.');
    }
  }

  return await updateUserById(id, data);
};

export const deleteUser = async (id: number) => {
  // Find all pamphlets owned by this user to cascade delete them
  const userPamphlets = await findPamphletsByuser_id(id);

  // Delete each pamphlet's contacts
  for (const pamphlet of userPamphlets) {
    if (pamphlet.id) {
      await deletePamphletContacts(pamphlet.id);
    }
  }

  // Delete user's pamphlets
  await deletePamphletsByUserId(id);

  return await deleteUserById(id);
};

export const getPamphletsByuser_id = async (user_id: number) => {
  return await findPamphletsByuser_id(user_id);
};
