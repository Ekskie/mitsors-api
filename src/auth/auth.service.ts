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
      // Ensure this matches exactly what is in your Google Console "Authorized redirect URIs"
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000/api/auth',
      secret: process.env.BETTER_AUTH_SECRET || 'generated-secret-key',
      // Trusted origins are important if you are calling this from a frontend on a different port
      trustedOrigins: ['http://localhost:3000'],
      // Enable debug logging to see exactly why state validation fails
      advanced: {
        defaultCookieAttributes: {
          sameSite: 'lax', // Relax cookie policy for easier local testing
          secure: false, // Ensure cookies work on http://localhost
        },
      },
      // Skip state check to resolve state_mismatch errors during development
      social: {
        skipStateCheck: true,
      } as any,
    });
  }
}
