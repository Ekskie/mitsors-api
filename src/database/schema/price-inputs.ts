import {
  pgTableCreator,
  text,
  timestamp,
  uuid,
  numeric,
  pgEnum,
} from 'drizzle-orm/pg-core';


// Livestock type is now free-form text (accept anything from frontend)

// Enum for price verification status (whether submitter was verified)
export const priceVerificationStatusEnum = pgEnum('price_verification_status', [
  'verified',
  'unverified',
]);


const pgTable = pgTableCreator((name) => `${name}`);

export const priceInputs = pgTable(
  'price_inputs',
  (c) => ({
    id: c.uuid().primaryKey().defaultRandom(),
    userId: c.uuid(),
    verificationStatus: priceVerificationStatusEnum('price_verification_status')
      .notNull()
      .default('unverified'),
    region: c.text().notNull(),
    city: c.text().notNull(),
    pricePerKg: c.numeric('price_per_kg', { precision: 10, scale: 2 }).notNull(),
    livestockType: c.text('livestock_type'),
    breed: c.text(),
    notes: c.text(),
    dateObserved: c.timestamp('date_observed', { mode: 'date' }).notNull(),
    createdAt: c.timestamp('created_at').defaultNow().notNull(),
    updatedAt: c.timestamp('updated_at').defaultNow().notNull(),
  })
);

// Type inference for TypeScript
export type PriceInput = typeof priceInputs.$inferSelect;
export type NewPriceInput = typeof priceInputs.$inferInsert;
