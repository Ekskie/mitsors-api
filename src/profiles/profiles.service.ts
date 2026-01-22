import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { profiles } from '../database/schema/profiles';
import { eq } from 'drizzle-orm';

// Updated DTOs to match your documentation and schema
export type CreateProfileDto = {
  firstName: string;
  lastName: string;
  email: string;
  displayName?: string;
  region?: string;
  city?: string;
  userRoles?: any[];
}

export type UpdateProfileDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  displayName?: string;
  region?: string;
  city?: string;
  userRoles?: any[];
}

@Injectable()
export class ProfilesService {
  constructor(private drizzleService: DrizzleService) { }

  async create(createProfileDto: CreateProfileDto) {
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

    // REMOVED 'phone' and 'address', ADDED new fields
    const [newProfile] = await this.drizzleService.db
      .insert(profiles)
      .values({
        firstName: createProfileDto.firstName,
        lastName: createProfileDto.lastName,
        email: createProfileDto.email,
        displayName: createProfileDto.displayName || `${createProfileDto.firstName} ${createProfileDto.lastName}`,
        region: createProfileDto.region || null,
        city: createProfileDto.city || null,
        userRoles: createProfileDto.userRoles || [],
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
    await this.findOne(id);

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
    await this.findOne(id);

    const [deletedProfile] = await this.drizzleService.db
      .delete(profiles)
      .where(eq(profiles.id, id))
      .returning();

    return deletedProfile;
  }
}