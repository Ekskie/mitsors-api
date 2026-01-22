import { pgTable, uuid, varchar, decimal, timestamp, text } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const submissions = pgTable('submissions', {
  // Unique ID for every submission
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Link this to the 'profiles' table - THIS IS THE BRIDGE
  profileId: uuid('profile_id')
    .references(() => profiles.id, { onDelete: 'cascade' })
    .notNull(),
    
  // Data fields based on your requirements
  region: varchar('region', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  pricePerKg: decimal('price_per_kg', { precision: 10, scale: 2 }).notNull(),
  livestockType: varchar('livestock_type', { length: 50 }), // fattener, piglet, or both
  breed: varchar('breed', { length: 100 }),
  notes: text('notes'),
  
  // Status at the time of submission
  verificationStatus: varchar('verification_status', { length: 50 }).default('unverified'),
  
  // Timestamps for history
  dateObserved: timestamp('date_observed').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});