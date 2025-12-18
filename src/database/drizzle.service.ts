import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DrizzleService implements OnModuleInit {
  public db: NodePgDatabase<typeof schema>;
  private readonly logger = new Logger(DrizzleService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const connectionString = this.configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      this.logger.error('DATABASE_URL is not defined in environment variables');
      throw new Error('DATABASE_URL is missing');
    }

    // Debug log to check if URL is loaded (masking password)
    this.logger.log(
      `Connecting to database: ${connectionString.replace(/:([^:@]+)@/, ':***@')}`,
    );

    const pool = new Pool({
      connectionString,
      ssl: true, // Required for Neon
    });

    try {
      // Test connection
      await pool.query('SELECT 1');
      this.logger.log('Database connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }

    this.db = drizzle(pool, { schema });
  }
}
