import fs from 'fs';
import path from 'path';
import {
  createPamphletResource,
  deletePamphletById,
  findPamphletById,
  findPamphletByurl_key,
  findPamphletsWithFilters,
  updatePamphletById,
} from '../repository/pamphlets.repository.js';
import {
  ForbiddenException,
  NotFoundException,
  UnAuthorizedException,
} from '../types/errors.js';

type QueryParams = {
  page?: string;
  limit?: string;
  category?: string;
  location?: string;
};

export type LocationType = {
  city: string;
  latitude: number;
  longitude: number;
};

export type PamphletPayload = {
  title: string;
  short_description: string;
  thumbnail_image?: string;
  category: string;
  location: LocationType;
  url_key: string;
  email?: string;
  phone: string;
  content?: string;
  contact: ContactType;
};

export type ContactType = {
  email?: string;
  phone: string;
};

export const getPamphletsWithFilters = async (query: QueryParams) => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const offset = (page - 1) * limit;

  const categories = query.category ? query.category.split(',') : undefined;
  const location = query.location;

  const { data, total } = await findPamphletsWithFilters({
    categories,
    location,
    limit,
    offset,
  });

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const pamphletByurl_key = async (url_key: string) => {
  const pamphlet = await findPamphletByurl_key(url_key);

  if (!pamphlet) {
    throw new NotFoundException();
  }

  return pamphlet;
};

// Bug Fix #3: forward `content` so it is actually saved to the DB
export const postPamphlet = async (
  payload: PamphletPayload,
  user_id?: number,
) => {
  if (!user_id) {
    throw new NotFoundException('User not found');
  }

  await createPamphletResource({
    title: payload.title,
    short_description: payload.short_description,
    thumbnail_image: payload.thumbnail_image,
    category: payload.category,
    location: payload.location,
    user_id,
    url_key: payload.url_key,
    content: payload.content, // Bug Fix #3: was missing
  });
};

// Bug Fix #7: delete old thumbnail file from disk when a new image is uploaded
export const updatePamphlet = async (
  id: number,
  payload: {
    title?: string;
    short_description?: string;
    thumbnail_image?: string | null;
    category?: string;
    location?: LocationType;
  },
  user_id?: number,
) => {
  if (!user_id) {
    throw new UnAuthorizedException('User not found');
  }

  const pamphlet = await findPamphletById(id);

  if (!pamphlet) {
    throw new NotFoundException('Pamphlet not found');
  }

  if (pamphlet.user_id !== user_id) {
    throw new ForbiddenException(
      'You are not authorized to update this pamphlet.',
    );
  }

  // Delete old thumbnail from disk if a new one is being set
  if (payload.thumbnail_image && pamphlet.thumbnail_image) {
    const oldPath = path.join('uploads', pamphlet.thumbnail_image);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  await updatePamphletById(id, {
    title: payload.title,
    short_description: payload.short_description,
    thumbnail_image: payload.thumbnail_image,
    category: payload.category,
    location: payload.location,
  });
};

export const deletePamphlet = async (id: number, user_id?: number) => {
  if (!user_id) {
    throw new UnAuthorizedException('User not found');
  }

  const pamphlet = await findPamphletById(id);

  if (!pamphlet) {
    throw new NotFoundException('Pamphlet not found');
  }

  if (pamphlet.user_id !== user_id) {
    throw new ForbiddenException(
      'You are not authorized to delete this pamphlet.',
    );
  }

  await deletePamphletById(id);
};
