import { pgTable, uuid, varchar, timestamp, boolean, text, jsonb } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  image: text('image'),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  displayName: varchar('display_name', { length: 100 }), // Added this
  region: varchar('region', { length: 100 }),           // Added this
  city: varchar('city', { length: 100 }),               // Added this
  userRoles: jsonb('user_roles').default([]),          // Added this (using jsonb for array)
  verificationStatus: varchar('verification_status', { length: 50 }).default('unverified'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});