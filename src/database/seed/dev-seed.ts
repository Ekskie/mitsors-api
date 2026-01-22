import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DrizzleService } from '../drizzle.service';
import { profiles, submissions } from '../schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

async function seed() {
  const envPath = resolve(__dirname, '../../../.env');
  dotenv.config({ path: envPath });

  console.log('--- Initializing NestJS Context ---');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const drizzle = app.get(DrizzleService);
  
  if (!drizzle) {
    throw new Error('DrizzleService not found in AppModule');
  }

  console.log('--- Seeding Started ---');

  try {
    // 1. Insert into profiles (which is now an alias for the 'user' table)
    const [testUser] = await drizzle.db.insert(profiles).values({
      id: 'test_user_id_001', // Manually providing ID for seeding
      name: 'Juan Dela Cruz', // Required by Better Auth
      email: 'juan.delacruz@gmail.com',
      emailVerified: true,
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      displayName: 'Juan Dela Cruz',
      region: 'Region III',
      city: 'Angeles City',
      userRoles: ['hog_raiser', 'midman'],
      verificationStatus: 'verified',
      createdAt: new Date(), // Required by Better Auth
      updatedAt: new Date(), // Required by Better Auth
    }).returning();

    console.log(`\n>>> CREATED USER ID: ${testUser.id} <<<\n`);

    // 2. Insert into submissions
    await drizzle.db.insert(submissions).values({
      id: 'test_sub_id_001',
      profileId: testUser.id, // Links to user.id
      region: 'Region III',
      city: 'Angeles City',
      pricePerKg: '185.50',
      livestockType: 'fattener',
      breed: 'Large White',
      verificationStatus: 'verified',
    });

    console.log('--- Seeding Successful ---');
  } catch (error) {
    console.error('--- Seeding Failed ---');
    console.error(error);
  } finally {
    await app.close();
  }
}

seed();