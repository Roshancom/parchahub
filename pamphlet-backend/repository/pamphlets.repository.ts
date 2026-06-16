import { and, eq, getTableColumns, inArray, like, sql } from 'drizzle-orm';
import db from '../db/index.js';
import {
  pamphletContacts,
  pamphlets,
  pamphletsLocations,
  users,
} from '../db/schema.js';

type Filters = {
  categories?: string[];
  location?: string;
  limit: number;
  offset: number;
};

export const findPamphletsWithFilters = async ({
  categories,
  location,
  limit,
  offset,
}: Filters) => {
  const conditions = [];

  if (categories?.length) {
    conditions.push(inArray(pamphlets.category, categories));
  }

  if (location) {
    // Escape SQL LIKE wildcards to prevent injection
    const escapedLocation = location.replace(/[%_]/g, '\\$&');
    conditions.push(like(pamphletsLocations.city, `%${escapedLocation}%`));
  }

  const data = await db
    .select({
      ...getTableColumns(pamphlets),
      location: {
        city: pamphletsLocations.city,
        latitude: pamphletsLocations.latitude,
        longitude: pamphletsLocations.longitude,
      },
    })
    .from(pamphlets)
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.location_id, pamphletsLocations.id),
    )
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(limit)
    .offset(offset);

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(pamphlets)
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.location_id, pamphletsLocations.id),
    )
    .where(conditions.length ? and(...conditions) : undefined);

  const total = totalResult[0]?.count || 0;

  return { data, total };
};

export const findPamphletByurl_key = async (url_key: string) => {
  const result = await db
    .select({
      id: pamphlets.id,
      title: pamphlets.title,
      category: pamphlets.category,
      user_id: pamphlets.user_id,
      url_key: pamphlets.url_key,
      created_at: pamphlets.created_at,
      author_name: users.name,
      location_id: pamphlets.location_id,
      short_description: pamphlets.short_description,
      thumbnail_image: pamphlets.thumbnail_image,
      content: pamphlets.content,
      location: {
        city: pamphletsLocations.city,
        latitude: pamphletsLocations.latitude,
        longitude: pamphletsLocations.longitude,
      },

      contact: {
        phone: pamphletContacts.phone,
        email: pamphletContacts.email,
      },
    })
    .from(pamphlets)
    .innerJoin(users, eq(pamphlets.user_id, users.id))
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.location_id, pamphletsLocations.id),
    )
    .leftJoin(pamphletContacts, eq(pamphlets.id, pamphletContacts.pamphlet_id))
    .where(eq(pamphlets.url_key, url_key));

  return result[0] || null;
};

export const findPamphletContact = async (pamphlet_id: number) => {
  const result = await db
    .select({
      phone: pamphletContacts.phone,
      email: pamphletContacts.email,
    })
    .from(pamphletContacts)
    .where(eq(pamphletContacts.pamphlet_id, pamphlet_id));

  return result[0] || null;
};

export const findPamphletLocation = async (pamphlet_id: number) => {
  const result = await db
    .select({
      city: pamphletsLocations.city,
      latitude: pamphletsLocations.latitude,
      longitude: pamphletsLocations.longitude,
    })
    .from(pamphlets)
    .leftJoin(
      pamphletsLocations,
      eq(pamphlets.location_id, pamphletsLocations.id),
    )
    .where(eq(pamphlets.id, pamphlet_id));

  return result[0] || null;
};

// Still used by createPamphletResource (INSERT only — correct for new pamphlets)
export const insertLocation = async (location?: {
  city: string;
  latitude: number;
  longitude: number;
}) => {
  if (!location) return null;

  const locationResult = await db
    .insert(pamphletsLocations)
    .values({
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .$returningId();

  return locationResult[0]?.id ?? null;
};

// Bug Fix #2: UPDATE in-place if a location_id already exists; INSERT only when there is none.
// This prevents unlimited orphan rows on every edit.
export const upsertLocation = async (
  existingLocationId: number | null | undefined,
  location?: { city: string; latitude: number; longitude: number },
): Promise<number | null> => {
  if (!location) return existingLocationId ?? null;

  if (existingLocationId) {
    await db
      .update(pamphletsLocations)
      .set({
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
      })
      .where(eq(pamphletsLocations.id, existingLocationId));
    return existingLocationId;
  }

  const result = await db
    .insert(pamphletsLocations)
    .values({
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .$returningId();

  return result[0]?.id ?? null;
};

export const createPamphletResource = async (data: {
  title: string;
  short_description: string;
  thumbnail_image?: string | null;
  category: string;
  location?: {
    city: string;
    latitude: number;
    longitude: number;
  };
  content?: string;
  user_id: number;
  url_key: string;
}) => {
  const location_id = await insertLocation(data.location);

  await db.insert(pamphlets).values({
    title: data.title,
    short_description: data.short_description,
    thumbnail_image: data.thumbnail_image || null,
    category: data.category,
    location_id: location_id,
    user_id: data.user_id,
    url_key: data.url_key,
    content: data.content,
  });
};

// Bug Fix #2 (continued): fetch existing location_id and upsert in-place
export const updatePamphletById = async (
  id: number,
  data: {
    title?: string;
    short_description?: string;
    thumbnail_image?: string | null;
    category?: string;
    location?: {
      city: string;
      latitude: number;
      longitude: number;
    };
  },
) => {
  const existing = await db
    .select({ location_id: pamphlets.location_id })
    .from(pamphlets)
    .where(eq(pamphlets.id, id));

  const location_id = await upsertLocation(
    existing[0]?.location_id,
    data.location,
  );

  return await db
    .update(pamphlets)
    .set({
      title: data.title,
      short_description: data.short_description,
      thumbnail_image: data.thumbnail_image,
      category: data.category,
      location_id: location_id,
    })
    .where(eq(pamphlets.id, id));
};

// Bug Fix #3 (part): include thumbnail_image so the service can delete the old file on disk
export const findPamphletById = async (id: number) => {
  const result = await db
    .select({
      id: pamphlets.id,
      user_id: pamphlets.user_id,
      location_id: pamphlets.location_id,
      thumbnail_image: pamphlets.thumbnail_image,
    })
    .from(pamphlets)
    .where(eq(pamphlets.id, id));

  return result[0];
};

export const deletePamphletById = async (id: number) => {
  return await db.delete(pamphlets).where(eq(pamphlets.id, id));
};

export const deletePamphletsByUserId = async (userId: number) => {
  return await db.delete(pamphlets).where(eq(pamphlets.user_id, userId));
};

export const deletePamphletContacts = async (pamphletId: number) => {
  return await db
    .delete(pamphletContacts)
    .where(eq(pamphletContacts.pamphlet_id, pamphletId));
};

export const deletePamphletLocation = async (locationId: number | null | undefined) => {
  if (!locationId) return;
  return await db
    .delete(pamphletsLocations)
    .where(eq(pamphletsLocations.id, locationId));
};
