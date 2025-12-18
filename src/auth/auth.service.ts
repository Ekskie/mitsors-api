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
      // Basic config
      secret: process.env.BETTER_AUTH_SECRET || 'generated-secret-key',
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    });
  }
}
