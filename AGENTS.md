# 🤖 Agent Instructions

## 📑 Table of Contents

- [📝 Documentation Maintenance](#-documentation-maintenance)
- [💰 API Project Overview](#-api-project-overview)
- [⭐ Core Features](#-core-features)
- [🛠️ Technical Overview](#️-technical-overview)
- [🏗️ Project Stack](#️-project-stack)
- [📂 Folder Structure Guidelines](#-folder-structure-guidelines)
- [📝 Version Control & Release Management](#-version-control--release-management)
- [✅ Best Practices and Coding Style](#-best-practices-and-coding-style)

---

## 📝 Documentation Maintenance

> ⚠️ **CRITICAL**: Keep AGENTS.md files synchronized with code changes at all times.

### Documentation Update Requirements

**When to Update AGENTS.md Files**:

- ✅ **ALWAYS** update the relevant `AGENTS.md` file when you:
  - Change folder structure or organization patterns
  - Add, remove, or modify code patterns or conventions
  - Update architectural decisions or approaches
  - Change file naming conventions or organization standards
  - Modify shared utilities, services, or common code patterns
  - Update module organization or dependency injection patterns
  - Change database patterns or ORM usage
  - Add new features that affect code organization

**Update Process**:

1. **Before or during code changes**: Identify which `AGENTS.md` files are affected
2. **Make code changes**: Implement your structural or pattern changes
3. **Update documentation**: Immediately update the relevant `AGENTS.md` file(s) to reflect the new structure/patterns
4. **Review**: Ensure documentation accurately describes the current state of the codebase
5. **Commit together**: Commit documentation updates alongside code changes in the same PR/commit when possible

**What to Document**:

- Folder structures and organization patterns
- File naming conventions
- Code patterns and best practices
- Architecture decisions and rationale
- Usage examples and guidelines
- Critical rules and conventions

> 💡 **Remember**: Outdated documentation is worse than no documentation. If the code structure changes but `AGENTS.md` doesn't, it creates confusion and inconsistency.

---

## 💰 API Project Overview

**Mitsors API** is a NestJS REST API application that provides backend services for the livestock price monitoring platform. The API handles price data aggregation, user management, authentication, and verification processes for real-time liveweight price data for hogs across the Philippines.

### ⭐ Core Features

1. **Price Data Management**
   - Real-time price input submission and aggregation
   - Verified and unverified price averages calculation
   - Regional price data aggregation across Philippine regions
   - Price submission history tracking

2. **User Management**
   - Optional authentication with social login (Google, Facebook) via better-auth
   - User profile management with location and role preferences
   - Anonymous user support with local storage
   - Role-based user identification (Hog Raiser, Public Market Seller, Midman)

3. **Verification System**
   - Multi-step verification process for traders
   - SMS phone verification
   - Valid ID and business permit document upload
   - Admin review workflow for verification approval
   - Verified trader badge and status management

4. **Location & Geographic Data**
   - Philippine region and city/municipality management
   - PSGC (Philippine Standard Geographic Code) integration
   - Location-based price filtering and aggregation

---

## 🛠️ Technical Overview

This project is a **NestJS REST API** application built with:

- **NestJS 11.0.1**: Progressive Node.js framework for building efficient and scalable server-side applications
- **PostgreSQL**: Relational database with Drizzle ORM for type-safe data modeling
- **TypeScript 5.7.3**: Type-safe development
- **Modular Architecture**: Feature-based modules with dependency injection
- **RESTful API**: REST API endpoints with `/api/v1` global prefix
- **Authentication**: better-auth for OAuth and session management
- **Geographic Focus**: Philippine regions and cities/municipalities

The architecture follows **NestJS best practices** with:

- **Modular design**: Feature modules with clear separation of concerns
- **Dependency Injection**: NestJS built-in DI container
- **Configuration Management**: Environment-based configuration with `@nestjs/config`
- **Database Integration**: PostgreSQL with Drizzle ORM for type-safe data persistence
- **Testing**: Jest for unit and e2e testing

---

## 🏗️ Project Stack

### Core Framework

- **Framework**: NestJS ^11.0.1
- **Runtime**: Node.js >=18
- **Language**: TypeScript ^5.7.3
- **Architecture**: Modular architecture with dependency injection

### Database & ORM

- **Database**: PostgreSQL
- **ORM**: drizzle-orm ^0.45.1
- **Driver**: pg ^8.16.3 (node-postgres)
- **Migration Tool**: drizzle-kit ^0.31.8
- **Connection**: PostgreSQL connection pool via DrizzleService

### Configuration & Environment

- **Config Module**: @nestjs/config ^4.0.2
- **Environment Variables**: `.env` file support
- **Global Config**: ConfigModule configured as global

### Testing

- **Testing Framework**: Jest ^30.0.0
- **NestJS Testing**: @nestjs/testing ^11.0.1
- **E2E Testing**: Supertest ^7.0.0
- **Test Runner**: ts-jest ^29.2.5

### Development Tools

- **CLI**: @nestjs/cli ^11.0.0
- **Code Formatting**: Prettier ^3.4.2
- **Linting**: ESLint ^9.18.0 with NestJS-specific rules
- **Type Checking**: TypeScript strict mode

### Infrastructure

- **HTTP Platform**: Express (via @nestjs/platform-express)
- **Package Manager**: npm (or bun if configured)
- **Build Tool**: NestJS CLI build system
- **Version Control**: Git with Conventional Commits

---

## 📝 Version Control & Release Management

The project uses **Conventional Commits** specification for commit messages and **semantic-release** for automated version management and releases.

### Conventional Commits

All commit messages follow the **Conventional Commits** specification to enable automated versioning and changelog generation.

**Commit Message Format**:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Supported Commit Types**:

- **`feat`**: A new feature (results in MINOR version bump)
- **`fix`**: A bug fix (results in PATCH version bump)
- **`docs`**: Documentation only changes
- **`chore`**: Changes to build process or auxiliary tools
- **`refactor`**: Code change that neither fixes a bug nor adds a feature
- **`perf`**: Performance improvements
- **`test`**: Adding or updating tests
- **`build`**: Changes to build system or dependencies
- **`ci`**: Changes to CI/CD configuration

**Commit Message Examples**:

```bash
# Feature commit (minor version bump)
feat(auth): add JWT authentication module

# Bug fix (patch version bump)
fix(users): resolve user data calculation error

# Documentation
docs: update API endpoint documentation

# Chore
chore(deps): update NestJS dependencies

# Breaking change (major version bump)
feat(api)!: redesign calculation system
```

**Breaking Changes**:

- Add `!` after the type/scope to indicate a breaking change (results in MAJOR version bump)
- Example: `feat(api)!: change calculation method`

### Semantic Release

**Automated Release Process**:

- **GitHub Actions Workflow**: Runs on pushes to `main` and `staging` branches
- **Version Detection**: Analyzes commit messages to determine version bump (major, minor, patch)
- **Changelog Generation**: Automatically generates changelog from commit messages
- **Git Tags**: Creates and pushes version tags to the repository
- **GitHub Releases**: Creates GitHub releases with changelog entries

**Version Bumping Rules**:

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes (`feat!`, `fix!`, etc. with `!`)
- **MINOR** (1.0.0 → 1.1.0): New features (`feat`)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes (`fix`)
- **No Release**: Other commit types (docs, chore, etc.) don't trigger releases

### Best Practices

**Commit Message Guidelines**:

- ✅ **ALWAYS** use conventional commit format
- ✅ Use clear, descriptive commit messages
- ✅ Include scope when commit affects specific module: `feat(auth): ...`, `fix(users): ...`
- ✅ Use imperative mood ("add feature" not "added feature")
- ✅ Keep first line under 72 characters
- ✅ Add body for complex changes explaining the "why"
- ❌ **NEVER** use generic messages like "update", "fix", "changes"

---

## 📂 Folder Structure Guidelines

This section provides **NestJS-specific patterns** for organizing code in the API application.

### General Organization Principles

**Feature-Based Module Organization**:

- Each feature should be organized as a self-contained module
- Modules should contain controllers, services, DTOs, entities/schemas, and tests
- Features should be easy to maintain, test, and remove

**NestJS Module Pattern**:

- **Module**: Defines the feature module with imports, controllers, and providers
- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic
- **DTOs**: Data Transfer Objects for request/response validation
- **Schemas**: Database table schemas (Drizzle ORM schemas)
- **Interfaces**: TypeScript interfaces for type safety

**When to Create a New Module**:

- ✅ Create a new module for each major feature (e.g., `auth`, `products`, `users`)
- ✅ Use shared/common modules for cross-cutting concerns (e.g., `database`, `config`)
- ✅ Group related functionality within the same module
- ✅ Keep modules focused and single-purpose

### Standard NestJS Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts             # Root application module
├── app.controller.ts          # Root controller (optional)
├── app.service.ts            # Root service (optional)
│
├── common/                    # Shared utilities and cross-cutting concerns
│   ├── decorators/           # Custom decorators
│   ├── filters/              # Exception filters
│   ├── guards/               # Authentication/authorization guards
│   ├── interceptors/         # Request/response interceptors
│   ├── pipes/                # Validation pipes
│   ├── interfaces/           # Shared interfaces
│   └── utils/                # Utility functions
│
├── config/                    # Configuration modules
│   └── configuration.ts      # Configuration service
│
├── database/                  # Database configuration
│   └── database.module.ts    # Database module (DrizzleService setup)
│
├── [feature]/                 # Feature modules (e.g., auth, products, users)
│   ├── [feature].module.ts   # Feature module definition
│   ├── [feature].controller.ts # Feature controller
│   ├── [feature].service.ts  # Feature service
│   ├── dto/                  # Data Transfer Objects
│   │   ├── create-[feature].dto.ts
│   │   └── update-[feature].dto.ts
│   ├── interfaces/           # Feature-specific interfaces
│   └── [feature].controller.spec.ts # Controller tests
│
├── database/                  # Database configuration and schemas
│   ├── database.module.ts    # Database module (DrizzleService)
│   ├── drizzle.service.ts    # Drizzle ORM service
│   ├── drizzle.config.ts     # Drizzle Kit configuration
│   └── schema/               # Database table schemas (Drizzle)
│       └── [table].ts        # Table schema definitions
│
└── test/                      # E2E tests (at root level)
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

### Module Structure Example

For a feature module (e.g., `products`):

```
src/products/
├── products.module.ts          # Module definition
├── products.controller.ts      # HTTP endpoints
├── products.service.ts         # Business logic
├── dto/
│   ├── create-product.dto.ts
│   ├── update-product.dto.ts
│   └── product-query.dto.ts
├── interfaces/
│   └── product.interface.ts
└── products.controller.spec.ts # Unit tests

# Note: Database schemas are defined in src/database/schema/
# e.g., src/database/schema/products.ts
```

### File Naming Conventions

1. **USE** `kebab-case` for all file and folder names:
   - Module files: `products.module.ts`, `user-management.module.ts`
   - Controller files: `products.controller.ts`, `auth.controller.ts`
   - Service files: `products.service.ts`, `auth.service.ts`
   - DTO files: `create-product.dto.ts`, `update-user.dto.ts`
   - Schema files: `products.ts`, `users.ts` (in `src/database/schema/`)
   - Test files: `products.controller.spec.ts`, `products.service.spec.ts`

2. **USE** `PascalCase` for class names in code:
   - Classes: `ProductsModule`, `ProductsController`, `ProductsService`
   - DTOs: `CreateProductDto`, `UpdateProductDto`
   - Schema tables: `products`, `users` (Drizzle table definitions use camelCase)

3. **USE** `camelCase` for variable and function names:
   - Variables: `productsService`, `userRepository`
   - Functions: `calculateTotal()`, `getUserById()`

### Common Module Structure

**Common/Shared Code**:

- **`common/`**: Shared utilities, decorators, guards, filters, interceptors, pipes
- **`config/`**: Configuration modules and services
- **`database/`**: Database connection and configuration

**Feature Modules**:

- Each feature should be self-contained
- Import shared modules from `common/` when needed
- Use dependency injection for cross-module dependencies

---

## ✅ Best Practices and Coding Style

### Module Organization

1. **FOLLOW NestJS Module Pattern**:
   - Create feature modules for each major feature
   - Use `@Module()` decorator to define module boundaries
   - Import dependencies explicitly in module imports array
   - Export services that need to be used by other modules

2. **USE Dependency Injection**:
   - Inject dependencies via constructor
   - Use `@Injectable()` decorator for services
   - Prefer constructor injection over property injection

```typescript
// ✅ CORRECT: Constructor injection
@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly configService: ConfigService,
  ) {}
}

// ❌ WRONG: Property injection (avoid unless necessary)
@Injectable()
export class ProductsService {
  @Inject(ProductsRepository)
  private productsRepository: ProductsRepository;
}
```

### Controllers

1. **USE Decorators for Routes**:
   - `@Controller()` for controller class
   - `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()` for HTTP methods
   - `@Param()`, `@Query()`, `@Body()` for request data
   - `@Headers()`, `@Req()`, `@Res()` when needed

2. **KEEP Controllers Thin**:
   - Controllers should only handle HTTP concerns
   - Delegate business logic to services
   - Return DTOs, not raw entities

```typescript
// ✅ CORRECT: Thin controller
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}

// ❌ WRONG: Business logic in controller
@Controller('products')
export class ProductsController {
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    // ❌ Don't put business logic here
    const calculated = this.calculateTotal(createProductDto);
    return this.saveToDatabase(calculated);
  }
}
```

### Services

1. **CONTAIN Business Logic in Services**:
   - Services handle all business logic
   - Services are injectable and reusable
   - Services can depend on other services

2. **USE Async/Await**:
   - Always use async/await for asynchronous operations
   - Return Promises from service methods

```typescript
// ✅ CORRECT: Async service method
@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }
}
```

### DTOs (Data Transfer Objects)

1. **ALWAYS USE DTOs** for request/response validation:
   - Create DTOs for all endpoints that accept data
   - Use class-validator decorators for validation
   - Use class-transformer for data transformation

2. **VALIDATE Input Data**:
   - Use `ValidationPipe` globally or per route
   - Add validation decorators to DTO properties

```typescript
// ✅ CORRECT: DTO with validation
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
```

### Database & Schemas

1. **USE Drizzle ORM Schemas** for PostgreSQL:
   - Define table schemas using Drizzle's `pgTable()` function
   - Create schema files in `src/database/schema/` directory
   - Export schemas from `src/database/schema/index.ts`
   - Inject `DrizzleService` in services to access the database

2. **FOLLOW Schema Patterns**:
   - Use Drizzle column types (text, integer, uuid, timestamp, etc.)
   - Define primary keys, foreign keys, and constraints
   - Use TypeScript types for type safety

```typescript
// ✅ CORRECT: Drizzle ORM schema
import { pgTable, text, integer, uuid, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Usage in service
import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { products } from '../database/schema';

@Injectable()
export class ProductsService {
  constructor(private drizzleService: DrizzleService) {}

  async findAll() {
    return this.drizzleService.db.select().from(products);
  }
}
```

### Updates (Flexible Input Acceptance)

- **Livestock Type**: Stored as free-form `text` instead of enum to accept any value sent by the frontend.
- **Region/City/Breed/Notes**: Accepted as `string` values without strict backend validation; frontend controls the options. Validation remains for `pricePerKg` range and date formatting.
- **Regional Aggregation Metadata**: Total regions count is derived from returned data rather than hard-coded.

3. **DATABASE Migrations**:
   - Use `npm run db:generate` to generate migration files
   - Use `npm run db:migrate` to run migrations
   - Use `npm run db:push` for development (pushes schema directly)
   - Use `npm run db:studio` to open Drizzle Studio GUI

### Error Handling

1. **USE Exception Filters**:
   - Create custom exception filters for consistent error handling
   - Use NestJS built-in exceptions (BadRequestException, NotFoundException, etc.)
   - Return appropriate HTTP status codes

2. **PROVIDE Meaningful Error Messages**:
   - Include context in error messages
   - Log errors appropriately
   - Don't expose sensitive information

```typescript
// ✅ CORRECT: Using NestJS exceptions
@Injectable()
export class ProductsService {
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
```

### Configuration

1. **USE @nestjs/config**:
   - Use ConfigModule for environment variables
   - Create typed configuration services
   - Validate configuration on startup

2. **ENVIRONMENT Variables**:
   - Store configuration in `.env` files
   - Never commit `.env` files with sensitive data
   - Use `.env.example` for documentation

### Code Quality

1. **FOLLOW TypeScript Best Practices**:
   - Use strict mode
   - Avoid `any` type - use proper types or `unknown`
   - Use interfaces for object shapes
   - Use type aliases for complex types

2. **FOLLOW ESLint Rules**:
   - Use configured ESLint rules
   - Fix linting errors before committing
   - Use Prettier for code formatting

3. **USE Meaningful Names**:
   - Use descriptive variable and function names
   - Follow naming conventions (camelCase, PascalCase, kebab-case)
   - Avoid abbreviations unless widely understood

4. **KEEP Functions Focused**:
   - Functions should do one thing
   - Split large functions into smaller ones
   - Keep functions under 50 lines when possible

### Testing

1. **WRITE Unit Tests**:
   - Test services and business logic
   - Use Jest for testing
   - Mock dependencies in tests
   - Aim for high test coverage

2. **WRITE E2E Tests**:
   - Test API endpoints end-to-end
   - Use Supertest for HTTP testing
   - Test happy paths and error cases

```typescript
// ✅ CORRECT: Unit test example
describe('ProductsService', () => {
  let service: ProductsService;
  let drizzleService: DrizzleService;

  beforeEach(async () => {
    const mockDrizzleService = {
      db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    drizzleService = module.get<DrizzleService>(DrizzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### API Design

1. **FOLLOW RESTful Conventions**:
   - Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
   - Use proper HTTP status codes
   - Use resource-based URLs

2. **USE API Versioning**:
   - Global prefix: `/api/v1`
   - Plan for future versions
   - Document breaking changes

3. **DOCUMENT Endpoints**:
   - Use Swagger/OpenAPI for API documentation
   - Add JSDoc comments to controllers
   - Document request/response formats

### Performance

1. **OPTIMIZE Database Queries**:
   - Use indexes appropriately
   - Avoid N+1 query problems
   - Use aggregation pipelines when needed

2. **USE Caching**:
   - Cache frequently accessed data
   - Use Redis for distributed caching (when needed)
   - Invalidate cache appropriately

3. **MONITOR Performance**:
   - Log slow queries
   - Monitor API response times
   - Use profiling tools

---

## 🎯 Quick Reference

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format

# Database commands
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes (development)
npm run db:studio    # Open Drizzle Studio
```

### Port Configuration

- **Default Port**: 3000 (configurable via `PORT` environment variable)
- **API Prefix**: `/api/v1`

### Key Directories

- `src/` - Source code
- `src/common/` - Shared utilities and cross-cutting concerns
- `src/config/` - Configuration modules
- `src/database/` - Database configuration and schemas
  - `src/database/schema/` - Drizzle ORM table schemas
  - `src/database/drizzle/` - Generated migration files
- `src/[feature]/` - Feature modules
- `test/` - E2E tests
- `dist/` - Compiled output (generated)

### Module Generation

```bash
# Generate a new module
nest g module [feature-name]

# Generate a controller
nest g controller [feature-name]

# Generate a service
nest g service [feature-name]

# Generate a complete resource (module + controller + service + DTOs)
nest g resource [feature-name]
```

---

## 📚 Additional Resources

- **NestJS Documentation**: https://docs.nestjs.com/
- **Drizzle ORM Documentation**: https://orm.drizzle.team/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/
- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Conventional Commits**: https://www.conventionalcommits.org/
- **REST API Design**: https://restfulapi.net/

---

> 🧠 This document provides NestJS-specific context and best practices for the API application. For general monorepo context, refer to the root `AGENTS.md` file.
