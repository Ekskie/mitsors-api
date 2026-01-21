import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { profiles } from '../database/schema/profiles';
import { eq } from 'drizzle-orm';

export type CreateProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

export type UpdateProfileDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

@Injectable()
export class ProfilesService {
  constructor(private drizzleService: DrizzleService) { }

  async create(createProfileDto: CreateProfileDto) {
    // Check if email already exists
    const existing = await this.drizzleService.db
      .select()
      .from(profiles)
      .where(eq(profiles.email, createProfileDto.email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException({
        error: true,
        message: 'Profile with this email already exists',
      });
    }

    const [newProfile] = await this.drizzleService.db
      .insert(profiles)
      .values({
        firstName: createProfileDto.firstName,
        lastName: createProfileDto.lastName,
        email: createProfileDto.email,
        phone: createProfileDto.phone || null,
        address: createProfileDto.address || null,
      })
      .returning();

    return newProfile;
  }

  async findAll() {
    return await this.drizzleService.db.select().from(profiles);
  }

  async findOne(id: string) {
    const [profile] = await this.drizzleService.db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);

    if (!profile) {
      throw new NotFoundException({
        error: true,
        message: 'Profile not found',
      });
    }

    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    // Check if profile exists
    await this.findOne(id);

    // If email is being updated, check if it's already taken
    if (updateProfileDto.email) {
      const existing = await this.drizzleService.db
        .select()
        .from(profiles)
        .where(eq(profiles.email, updateProfileDto.email))
        .limit(1);

      const existingProfile = existing[0];
      if (existingProfile && existingProfile.id !== id) {
        throw new ConflictException({
          error: true,
          message: 'Profile with this email already exists',
        });
      }
    }

    const [updatedProfile] = await this.drizzleService.db
      .update(profiles)
      .set({
        ...updateProfileDto,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id))
      .returning();

    return updatedProfile;
  }

  async remove(id: string) {
    // Check if profile exists
    await this.findOne(id);

    const [deletedProfile] = await this.drizzleService.db
      .delete(profiles)
      .where(eq(profiles.id, id))
      .returning();

    return deletedProfile;
  }
}

