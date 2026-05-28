// drizzle/schema.ts
import {
  bigint,
  double,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 100 }),
  password: varchar('password', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const categories = mysqlTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  slug: varchar('slug', { length: 100 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const pamphlets = mysqlTable('pamphlets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  short_description: text('short_description'),
  content: text('content'),
  thumbnail_image: varchar('thumbnail_image', { length: 255 }),
  category: varchar('category', { length: 100 }),
  location_id: bigint('location_id', {
    mode: 'number',
    unsigned: true,
  }).references(() => pamphletsLocations.id, { onDelete: 'set null' }),
  user_id: bigint('user_id', { mode: 'number', unsigned: true }),
  url_key: varchar('url_key', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const pamphletImages = mysqlTable('pamphlet_images', {
  id: serial('id').primaryKey(),
  pamphlet_id: bigint('pamphlet_id', { mode: 'number', unsigned: true }),
  image_url: text('image_url'),
});

export const pamphletContacts = mysqlTable('pamphlet_contacts', {
  id: serial('id').primaryKey(),
  pamphlet_id: bigint('pamphlet_id', { mode: 'number', unsigned: true }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
});

export const pamphletsLocations = mysqlTable('pamphlets_location', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 255 }),
  latitude: double('latitude'),
  longitude: double('longitude'),
});
