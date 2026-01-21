import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load .env file for drizzle-kit CLI
// Assuming this file is in the root, dotenv.config() loads the .env from the same directory
dotenv.config();

export default defineConfig({
  schema: './src/database/schema/index.ts', // Points to your schema definition
  out: './src/database/drizzle', // Where migration files will be generated
  dialect: 'postgresql',
  dbCredentials: {
    // We use DATABASE_URL to match your .env and DrizzleService configuration
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
