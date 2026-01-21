import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class AuthService implements OnModuleInit {
  public auth: ReturnType<typeof betterAuth>;

  constructor(@Inject('DRIZZLE') private db: NodePgDatabase<typeof schema>) {}

  onModuleInit() {
    this.auth = betterAuth({
      database: drizzleAdapter(this.db, {
        provider: 'pg',
        schema: schema,
      }),
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        facebook: {
          clientId: process.env.FACEBOOK_APP_ID!,
          clientSecret: process.env.FACEBOOK_APP_SECRET!,
        },
      },
      emailAndPassword: {
        enabled: true,
      },
      // Ensure this matches the full path your NestJS app is serving
      // If main.ts has globalPrefix 'api/v1' and Controller has 'auth', this must include both.
      baseURL:
        process.env.BETTER_AUTH_URL || 'http://localhost:3000/api/v1/auth',
      basePath: '/api/v1/auth', // Explicitly set the base path for internal routing
      secret: process.env.BETTER_AUTH_SECRET || 'generated-secret-key',
      trustedOrigins: ['http://localhost:3000'],
      advanced: {
        defaultCookieAttributes: {
          sameSite: 'lax',
          secure: false,
        },
      },
      social: {
        skipStateCheck: true,
      } as any,
    });
  }
}
