# Database Setup with Drizzle ORM

This module provides Drizzle ORM integration with PostgreSQL for the NestJS API.

## Configuration

The database connection is configured via environment variables:

- `POSTGRES_URL` - PostgreSQL connection string (used by drizzle-kit CLI and preferred for NestJS app)

Example:

```env
POSTGRES_URL=postgresql://user:password@localhost:5432/payroll
```

**Important**: The `drizzle.config.ts` file uses `dotenv` to load `.env` files because drizzle-kit runs as a CLI tool outside of the NestJS application context. The NestJS `ConfigModule` only loads environment variables when the NestJS application is running, so it doesn't affect drizzle-kit commands.

## Usage

### Injecting DrizzleService

The `DrizzleService` is globally available and can be injected into any service:

```typescript
import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';

@Injectable()
export class YourService {
  constructor(private drizzleService: DrizzleService) {}

  async getData() {
    return await this.drizzleService.db.select().from(yourTable);
  }
}
```

### Creating Schemas

1. Create schema files in `src/database/schema/`
2. Export them from `src/database/schema/index.ts`

Example schema:

```typescript
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Schema Change Workflow

When you add, update, or delete a schema, follow these steps:

#### Adding a New Schema

1. **Create the schema file** in `src/database/schema/` (e.g., `products.ts`)
2. **Export the schema** from `src/database/schema/index.ts`
3. **Generate migration files**:

   ```bash
   npm run db:generate
   ```

4. **Review the generated migration** in `src/database/drizzle/` to ensure it's correct
5. **Run the migration** to apply changes to your database:

   ```bash
   npm run db:migrate
   ```

#### Updating an Existing Schema

1. **Modify the schema file** in `src/database/schema/` (e.g., add/remove columns, change types)
2. **Generate migration files**:

   ```bash
   npm run db:generate
   ```

3. **Review the generated migration** to verify the changes (especially for data migrations or column renames)
4. **Run the migration**:

   ```bash
   npm run db:migrate
   ```

#### Deleting a Schema

1. **Remove the schema export** from `src/database/schema/index.ts`
2. **Delete the schema file** from `src/database/schema/`
3. **Generate migration files**:

   ```bash
   npm run db:generate
   ```

4. **Review the generated migration** - this will create a DROP TABLE statement
5. **Run the migration**:

   ```bash
   npm run db:migrate
   ```

**⚠️ Important Notes:**

- **Always review generated migrations** before running them, especially for destructive operations (DROP, DELETE)
- **In development**, you can use `npm run db:push` to push schema changes directly without generating migration files (not recommended for production)
- **In production**, always use `db:generate` and `db:migrate` to maintain migration history
- **Test migrations** on a development/staging database before applying to production
- **Backup your database** before running migrations in production

### Database Migrations

Use Drizzle Kit commands:

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema changes directly (development only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Files

- `drizzle.service.ts` - Drizzle service provider for NestJS (uses ConfigService for environment variables)
- `database.module.ts` - Database module (globally exported)
- `schema/` - Database schema definitions
- `drizzle.config.ts` - Drizzle Kit configuration (uses dotenv to load .env for CLI commands)
- `drizzle/` - Generated migration files (created by `db:generate`)

## Important Notes

- **Environment Variables**: The `drizzle.config.ts` file runs outside of NestJS, so it uses `dotenv` to load `.env` files. The NestJS `ConfigModule` only works when the application is running.
- **Migration Output**: Migrations are generated in `src/database/drizzle/` directory
- **Config Location**: The config file is located at `src/database/drizzle.config.ts` (not at the root) and is referenced in package.json scripts with `--config` flag
