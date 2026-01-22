import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { profiles, submissions } from '../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private drizzleService: DrizzleService) {}

  // Task 1: GET /api/v1/users/profile
  async getProfile(userId: string) {


    if (!userId) {
      console.error('ERROR: userId is undefined or null. Check your .env file.');
    }

    const [user] = await this.drizzleService.db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!user) {
      console.warn('DB RESULT: No user found with this ID.');
      throw new NotFoundException({ 
        statusCode: 404, 
        message: 'User profile not found', 
        error: 'Not Found' 
      });
    }

    return user;
  }

  // Task 2: PATCH /api/v1/users/profile
  async updateProfile(userId: string, data: any) {


    const [updated] = await this.drizzleService.db
      .update(profiles)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      })
      .where(eq(profiles.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundException('Cannot update. Profile not found.');
    }

    return { 
      success: true, 
      message: 'Profile updated successfully', 
      user: updated 
    };
  }

  // Task 3: GET /api/v1/users/submissions
  async getSubmissions(userId: string) {


    const results = await this.drizzleService.db
      .select()
      .from(submissions)
      .where(eq(submissions.profileId, userId));

    return {
      submissions: results,
      pagination: { total: results.length }
    };
  }

  // Task 4: GET /api/v1/users/submissions/:id
  async getSubmissionById(userId: string, submissionId: string) {

    const [submission] = await this.drizzleService.db
      .select()
      .from(submissions)
      .where(
        and(
          eq(submissions.id, submissionId),
          eq(submissions.profileId, userId)
        )
      )
      .limit(1);

    if (!submission) {
      throw new NotFoundException({ 
        statusCode: 404, 
        message: 'Submission not found', 
        error: 'Not Found' 
      });
    }
    return submission;
  }
}