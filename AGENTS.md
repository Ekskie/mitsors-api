# 🤖 Agent Instructions

## 📑 Table of Contents

- [📝 Documentation Maintenance](#-documentation-maintenance)
- [💰 MITSORS Web Project Overview](#-mitsors-web-project-overview)
- [🛠️ Technical Overview](#️-technical-overview)
- [🏗️ Project Stack](#️-project-stack)
- [🗄️ Database & ORM](#️-database--orm)
- [📂 Folder Structure Guidelines](#-folder-structure-guidelines)
- [📝 Version Control & Release Management](#-version-control--release-management)
- [🎨 Styling System](#-styling-system)
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
  - Update state management patterns or data fetching approaches
  - Change styling approaches or component organization
  - Add new features that affect code organization

**Which AGENTS.md to Update**:

- **Root `AGENTS.md`**: Update for changes affecting the entire project, general principles, or project-wide conventions
- **Feature-specific `AGENTS.md`** (e.g., `app/[feature]/AGENTS.md`): Update for changes specific to that feature or module

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

## 💰 MITSORS Web Project Overview

This section outlines the key screens and features of the MITSORS web application, intended for reference in development and AI prompting. Each numbered item corresponds to a screen in the app.

### 1. Initial loading screen

- Home screen with navigation and content display.

---

## 🛠️ Technical Overview

This project is a **Next.js 16** web application built with **React 19** and **TypeScript**. It uses Tailwind CSS 4 for styling with Radix UI primitives and shadcn/ui components. The database layer uses Drizzle ORM with Neon PostgreSQL. The agent should follow these conventions when suggesting code or completing functions.

The architecture follows modern React patterns with:

- **Server Components** by default (Next.js App Router)
- **Client Components** for interactive features (`'use client'`)
- **TypeScript** throughout for type safety
- **Component-based architecture** for reusability

---

## 🏗️ Project Stack

- **Framework**: Next.js 16.1.1 (App Router) for modern routing and server components
- **UI Library**: React 19.2.3 for building the UI
- **Language**: TypeScript 5.x for type safety
- **Styling**: Tailwind CSS 4 with Tailwind Animate (tw-animate-css)
- **UI Components**: Radix UI primitives (@radix-ui/react-\*) for accessible components
- **Component Library**: shadcn/ui (configured via components.json) for consistent UI patterns
- **Icons**: Lucide React ^0.562.0 for consistent, customizable icons (use descriptive names)
- **Fonts**: Geist Sans & Geist Mono (Next.js Google Fonts)
- **Data Fetching & Server State**: TanStack Query (React Query) - RECOMMENDED for ALL server requests (real & dummy)
- **Form Management**: React Hook Form (when forms are added) with Zod for validation
- **UI State Management**: useState for local UI state ONLY (NEVER for server/API data state)
- **Database & ORM**: Drizzle ORM ^0.45.1 with Neon PostgreSQL (serverless)
- **Database Client**: @neondatabase/serverless ^1.0.2
- **ORM Toolkit**: drizzle-kit ^0.31.8 (for migrations and schema management)
- **Utilities**: clsx ^2.1.1, tailwind-merge ^3.4.0, class-variance-authority ^0.7.1
- **Package Manager**: Bun (bun.lock present)
- **Node Version**: >=20
- **Linting**: ESLint 9 with Next.js config
- **Formatting**: Prettier ^3.7.4
- **Release Management**: semantic-release ^24.2.6 with Conventional Commits

> 🔒 **CRITICAL**: TanStack Query is RECOMMENDED for all server operations (real API AND dummy/mock APIs). useState is ONLY for UI state, NEVER for server/API data state.

---

## 🗄️ Database & ORM

This project uses **Drizzle ORM** with **Neon PostgreSQL** for database operations. Drizzle provides a type-safe, lightweight ORM with excellent TypeScript support.

### Database Setup

**Database Provider**: Neon PostgreSQL (serverless)

**Configuration**:

1. **Environment Variable**: Set `DATABASE_URL` in your `.env.local` file:

   ```bash
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

2. **Database Connection**: Located in `lib/db/index.ts`
   - Uses `@neondatabase/serverless` for serverless PostgreSQL connection
   - Uses `drizzle-orm/neon-http` adapter for HTTP-based queries
   - Automatically validates `DATABASE_URL` environment variable

3. **Drizzle Configuration**: `drizzle.config.ts`
   - Schema location: `./lib/db/schema.ts`
   - Migration output: `./drizzle`
   - Dialect: PostgreSQL

### Database Structure

**Schema Location**: `lib/db/schema.ts`

- ✅ **Define tables** using Drizzle's `pgTable` function
- ✅ **Export types** using `$inferSelect` and `$inferInsert` for type safety
- ✅ **Use PostgreSQL-specific types** from `drizzle-orm/pg-core`

**Example Schema**:

```typescript
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  author: varchar('author', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

### Database Usage

**Import Database Instance**:

```typescript
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
```

**Query Examples**:

```typescript
// Select all records
const allPosts = await db.select().from(posts);

// Select with conditions
const post = await db.select().from(posts).where(eq(posts.id, 1));

// Insert record
const newPost = await db
  .insert(posts)
  .values({
    title: 'My Post',
    content: 'Post content',
    author: 'John Doe',
  })
  .returning();

// Update record
await db.update(posts).set({ title: 'Updated Title' }).where(eq(posts.id, 1));

// Delete record
await db.delete(posts).where(eq(posts.id, 1));
```

### API Routes with Database

**Example API Route**: `app/api/posts/route.ts`

The project includes a sample API route demonstrating database operations:

- **GET `/api/posts`**: Fetch all posts
- **POST `/api/posts`**: Create a new post

**Best Practices for API Routes**:

1. ✅ **ALWAYS** handle errors with try-catch blocks
2. ✅ **ALWAYS** validate request data before database operations
3. ✅ **ALWAYS** return appropriate HTTP status codes
4. ✅ **USE** TypeScript types from schema (`Post`, `NewPost`)
5. ✅ **LOG** errors for debugging (server-side only)
6. ✅ **RETURN** user-friendly error messages

**Example API Route Structure**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';

export async function GET() {
  try {
    const allPosts = await db.select().from(posts);
    return NextResponse.json(allPosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate and insert
    const newPost = await db.insert(posts).values(body).returning();
    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 },
    );
  }
}
```

### Database Migrations

**Drizzle Kit Commands**:

- `bun run db:generate` - Generate migration files from schema changes
- `bun run db:migrate` - Run pending migrations
- `bun run db:push` - Push schema changes directly to database (development)
- `bun run db:studio` - Open Drizzle Studio (database GUI)

**Migration Workflow**:

1. **Modify schema** in `lib/db/schema.ts`
2. **Generate migration**: `bun run db:generate`
3. **Review migration** files in `./drizzle` directory
4. **Apply migration**: `bun run db:migrate` (or `bun run db:push` for development)

> 💡 **Tip**: Use `db:push` for rapid development, use `db:migrate` for production-ready migrations

### Database Best Practices

1. **Schema Organization**:
   - ✅ Keep all table definitions in `lib/db/schema.ts`
   - ✅ Export types for each table using `$inferSelect` and `$inferInsert`
   - ✅ Use descriptive table and column names (snake_case for database, camelCase for TypeScript)

2. **Type Safety**:
   - ✅ **ALWAYS** use inferred types from schema (`typeof table.$inferSelect`)
   - ✅ **ALWAYS** import types from schema file, not inline
   - ✅ **USE** TypeScript types in API routes and components

3. **Error Handling**:
   - ✅ **ALWAYS** wrap database operations in try-catch blocks
   - ✅ **ALWAYS** return appropriate HTTP status codes
   - ✅ **LOG** errors server-side (never expose database errors to clients)
   - ✅ **PROVIDE** user-friendly error messages

4. **Performance**:
   - ✅ Use `.select()` with specific columns when possible
   - ✅ Use `.where()` clauses to filter data
   - ✅ Use `.limit()` and `.offset()` for pagination
   - ✅ Consider indexing frequently queried columns

5. **Security**:
   - ✅ **NEVER** expose `DATABASE_URL` in client-side code
   - ✅ **ALWAYS** validate and sanitize user input before database operations
   - ✅ **USE** parameterized queries (Drizzle handles this automatically)
   - ✅ **NEVER** trust client-side data - always validate on the server

### Database File Organization

```text
lib/
└── db/
    ├── index.ts          # Database connection and export
    └── schema.ts         # Table definitions and types
```

**When to Create Route-Specific Database Code**:

- ✅ **Route-specific queries**: Create custom query functions in `app/[route]/lib/db-queries.ts`
- ✅ **Route-specific types**: Extend base types in route-specific files
- ✅ **Complex queries**: Create reusable query functions in route `lib/` folder

---

## 📂 Folder Structure Guidelines

```text
/app/                                 # Next.js App Router directory (file-based routing)
├── favicon.ico
├── globals.css                       # Global styles and Tailwind config
├── layout.tsx                        # Root layout component with Navbar
├── page.tsx                          # Home page (landing page with hero and ticker)
├── providers.tsx                     # React Query provider and other providers
├── components/                       # App-level components (shared across routes)
│   ├── navbar.tsx                    # Navigation bar (top-level navigation)
│   ├── hero-section.tsx              # Hero section with CTA
│   ├── price-ticker.tsx              # Real-time price ticker
│   ├── footer.tsx                    # Landing page footer
│   ├── wizard-modal.tsx              # Onboarding wizard modal
│   ├── dashboard-content.tsx         # Aggregated price content (shared with dashboard)
│   ├── regional-price-table.tsx      # Regional price table (shared with dashboard)
│   ├── submit-price-modal.tsx        # Submit price modal (shared with dashboard)
│   ├── theme-toggle.tsx              # Theme toggle button
│   └── ...                           # Other shared components
│
├── dashboard/                        # Dashboard route (/dashboard)
│   └── page.tsx                      # Dashboard page
│
├── api/                              # API routes
│   ├── v1/
│   │   ├── prices/
│   │   │   ├── regional/
│   │   │   │   └── route.ts         # GET /api/v1/prices/regional
│   │   │   └── aggregated/
│   │   │       └── route.ts         # GET /api/v1/prices/aggregated
│   │   └── ...
│   └── ...
│
/components/                          # COMMON/SHARED components
│   └── ui/                           # shadcn/ui atomic components (USE THESE!)
│       ├── button.tsx                # Primary button component
│       ├── input.tsx                 # Text input component
│       ├── card.tsx                  # Card layout component
│       ├── dialog.tsx                # Dialog/modal component
│       ├── form.tsx                  # Form components
│       ├── skeleton.tsx              # Skeleton loading component
│       └── ...                       # Other UI components
│
/hooks/                               # COMMON/SHARED custom hooks
│   ├── use-regional-prices.ts       # Hook for regional prices
│   ├── use-prices-aggregated.ts     # Hook for aggregated prices
│   ├── use-submit-price.ts          # Hook for price submission
│   ├── use-user-profile.ts          # Hook for user profile
│   ├── use-theme.ts                 # Hook for theme management
│   └── use-toast.tsx                # Hook for toast notifications
│
/constants/                           # COMMON/SHARED App constants
│   ├── livestock-data.ts            # Livestock types and breeds
│   └── philippine-locations.ts      # Philippine regions and locations
│
/lib/                                 # COMMON/SHARED utilities
│   ├── utils.ts                      # Utility functions (cn, etc.)
│   ├── api/
│   │   ├── client.ts               # API client setup (axios, fetch)
│   │   └── types.ts                # Shared API types
│   └── db/                          # Database configuration and schema
│       ├── index.ts                # Database connection (drizzle instance)
│       └── schema.ts               # Database schema definitions
│
/drizzle/                             # Generated migration files (gitignored)
/public/                              # Static assets (images, fonts, icons)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
/components.json                      # shadcn/ui configuration
/drizzle.config.ts                    # Drizzle ORM configuration
/next.config.ts                       # Next.js configuration
/postcss.config.mjs                   # PostCSS configuration
/tsconfig.json                        # TypeScript configuration
/eslint.config.mjs                    # ESLint configuration
/changelog.config.js                  # Changelog configuration
/.releaserc.js                        # semantic-release configuration
/package.json
bun.lock
```

### 📋 Folder Organization Philosophy

**Root-level folders** (`/components`, `/hooks`, `/constants`, `/lib`):

- For **COMMON/SHARED** code used across multiple features
- Examples: shared UI components, base API configuration, global utilities, database connection, shared hooks
- ⚠️ **Important**: Use root-level folders only when code is reused in 2+ features or is truly global

**Route-level folders** (`/app/[route]/components`, `/app/[route]/hooks`, etc.):

- For **FEATURE-SPECIFIC** code used only within that feature
- Examples: route-specific form logic, route-specific components, route-related API calls, feature-specific utilities
- Keeps features self-contained and easier to maintain/remove

**When to use which:**

- ✅ Use **root-level** if the code is reused in 2+ features or is truly global
- ✅ Use **route-level** if the code is specific to that feature only
- ✅ Start with **route-level**, move to **root-level** when you need to share it
- ✅ **For state**: Start with `useState`, move to TanStack Query for server data, move to shared hooks if needed across multiple routes

**Component Organization Standard:**

> 🚨 **CRITICAL RULE**: Root `/components/` is **ONLY** for common/shared components used across 2+ features. Feature-specific components **MUST** be in their feature folders.

- ✅ **Root `/components/`**: Only for truly common/shared components (e.g., `Button`, `Input`, `Card` - used across multiple features)
- ✅ **UI Components**: All shadcn/ui components in `/components/ui/` (see UI Component Library section below)
- ✅ **Route-specific components**: All feature-specific components go in their route's `components/` folder (e.g., `/app/users/components/` for user-specific components)
- ❌ **NEVER** put feature-specific components in root `/components/`
- ❌ **NEVER** create duplicate components when UI components exist in `/components/ui/`

**Examples:**

```typescript
// ✅ CORRECT: Feature-specific component in feature folder
/app/erssu / components / user -
  card.tsx / app / users / components / user -
  form.tsx /
    // ✅ CORRECT: Common component in root
    components /
    ui /
    button.tsx /
    components /
    ui /
    input.tsx /
    // ❌ WRONG: Feature-specific component in root
    components /
    user -
  card.tsx; // ❌ Don't do this!
```

> 🧠 Follow this structure for consistency, readability, and maintainability. The structure follows Next.js App Router best practices.

### 🎨 UI Component Library (`/components/ui/`)

> 🚨 **CRITICAL RULE**: ALWAYS check `/components/ui/` for existing atomic components BEFORE creating any custom UI elements. Never duplicate functionality that already exists in the atomic UI library.

See the **Best Practices > UI Components - Critical Rules** section below for detailed usage guidelines.

---

## 📝 Version Control & Release Management

The project uses **Conventional Commits** specification for commit messages and **semantic-release** for automated version management and releases.

### Conventional Commits

All commit messages follow the **Conventional Commits** specification to enable automated versioning and changelog generation.

**Commit Message Format**:

```text
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
feat: add user management form

# Bug fix (patch version bump)
fix(button): resolve button styling issue

# Documentation
docs: update component usage guidelines

# Chore
chore(deps): update dependencies

# Breaking change (major version bump)
feat!: redesign data processing flow
```

**Breaking Changes**:

- Add `!` after the type/scope to indicate a breaking change (results in MAJOR version bump)
- Example: `feat(api)!: change API structure`

### Semantic Release

**Automated Release Process**:

- **Configuration**: `.releaserc.js` and `changelog.config.js`
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
- ✅ Include scope when commit affects specific area: `feat(user): ...`, `fix(ui): ...`
- ✅ Use imperative mood ("add feature" not "added feature")
- ✅ Keep first line under 72 characters
- ✅ Add body for complex changes explaining the "why"
- ❌ **NEVER** use generic messages like "update", "fix", "changes"

---

## 🎨 Styling System

This project uses **Tailwind CSS 4** for styling with a custom theme configuration.

### Styling Approach

1. **Tailwind CSS 4** is configured with CSS-based theme configuration in `globals.css`
2. **Global styles** are defined in `app/globals.css`
3. **Tailwind classes** work on React components via the `className` prop
4. **Custom theme** is configured in `globals.css` using CSS variables (Tailwind 4 CSS-based configuration)
5. **Radix UI** components are styled with Tailwind classes
6. **shadcn/ui** provides pre-styled component primitives based on Radix UI
7. **Tailwind Animate** (tw-animate-css) provides animation utilities

> 🎨 **CRITICAL: Tailwind 4 Configuration Priority**
>
> - ✅ **PRIMARY**: Configure Tailwind in `globals.css` using CSS-based configuration (Tailwind 4 recommended approach)
> - ⚠️ **LAST RESORT**: Use `tailwind.config.js` only when CSS-based configuration is not sufficient
> - 💡 **Why**: Tailwind CSS 4 prefers CSS-based configuration for better performance and simpler setup

### Theme Colors

The project uses a custom color palette defined in `globals.css`:

- **Primary Colors**: Custom primary palette with foreground variants
- **Secondary Colors**: Custom secondary palette with foreground variants
- **Muted Colors**: Muted palette for subtle backgrounds
- **Accent Colors**: Accent palette for highlights
- **Destructive Colors**: Error/destructive action colors
- **Chart Colors**: Chart color palette (chart-1 through chart-5)
- **Sidebar Colors**: Sidebar-specific color palette
- **Semantic Colors**: Border, input, ring, popover, card colors

### Custom Fonts

- **Geist Sans**: Primary body font (via Next.js Google Fonts)
- **Geist Mono**: Monospace font for code (via Next.js Google Fonts)

### Configuration Files

- **Tailwind CSS configuration**: Configured in `app/globals.css` using CSS `@theme` directive
- **PostCSS configuration**: `postcss.config.mjs` for processing CSS
- **shadcn/ui configuration**: `components.json` for component library settings

### Usage in Components

Use standard Tailwind CSS classes on React components:

```tsx
<div className="flex items-center justify-center bg-primary p-4">
  <h1 className="text-lg font-bold text-foreground">Hello World</h1>
</div>
```

### Icon System

> 🎨 **ICON LIBRARY**: Use **Lucide React** for all icons in the app
> 🏷️ **NAMING CONVENTION**: Always use descriptive names (e.g., `ArrowUpRight`, `Menu`, `X`)
> 🚫 **NO EMOJIS**: NEVER use emojis (🚀, 💡, ✅, etc.) in the UI - ALWAYS use Lucide icons instead

**Why Lucide Icons**:

- ✅ Consistent, professional icon design
- ✅ Tree-shakeable (only import icons you use)
- ✅ Customizable size and color
- ✅ Wide variety of icons (~1000+ icons available)
- ✅ Professional appearance (no emojis!)

**How to Use Lucide Icons**:

```tsx
// Import specific icons
import { ArrowUpRight, Menu, X, Search, Plus, Edit, Trash2 } from 'lucide-react';

// Basic usage
<Menu size={24} className="text-foreground" />

// In components
<Button>
  <ArrowUpRight size={20} />
  Submit
</Button>

// With semantic colors
<Plus size={20} className="text-primary" />
```

**Icon Usage Guidelines**:

- ✅ **ALWAYS** use Lucide icons with descriptive names for UI elements
- ✅ Import only the specific icons you need (tree-shaking)
- ✅ Use consistent sizing: 16px (sm), 20px (md), 24px (lg), 28px (xl)
- ✅ Match icon colors to design system using semantic color classes (e.g., `text-primary`, `text-muted-foreground`)
- ✅ Use `className` prop for styling with Tailwind classes
- ❌ **NEVER** use emoji as icons in production code
- ❌ **NEVER** use emojis for visual indicators, status, or decorative purposes
- ❌ **AVOID** custom SVG icons unless absolutely necessary
- ❌ **NEVER** hardcode emoji characters in UI components or user-facing text
- 💡 **Rule**: If you think of using an emoji, find the equivalent Lucide icon instead

**Common Icons by Use Case**:

- **Navigation**: Home, Menu, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight
- **Actions**: Plus, Edit, Trash2, Save, X, Check
- **Forms**: User, Mail, Lock, Phone, Search, Eye, EyeOff
- **Status**: CheckCircle, XCircle, AlertCircle, Info
- **Social**: Heart, MessageCircle, Share2, ThumbsUp
- **Media**: Image, Video, Camera, Upload
- **Settings**: Settings, Filter, MoreVertical, MoreHorizontal

**Finding Icons**:
Visit <https://lucide.dev/icons> to browse all available icons.

---

## ✅ Best Practices and Coding Style

### UI Components - Critical Rules

> 🚨 **MANDATORY WORKFLOW**: Before implementing ANY UI element, ALWAYS follow these steps:

1. **🔍 CHECK FIRST**: Look in `/components/ui/` for existing atomic components
2. **📖 REVIEW**: Check available shadcn/ui components to see all available exports
3. **🎯 USE**: Import and use the atomic component if it exists
4. **❌ NEVER**: Create custom implementations of alerts, buttons, inputs, cards, etc.

**Examples of what to check for:**

- Need to show info/error/success message? → Use appropriate shadcn/ui component or create based on Alert/Dialog pattern
- Need a button? → Use `<Button variant="default|destructive|outline|ghost" />` from shadcn/ui
- Need input field? → Use `<Input />` from shadcn/ui with proper props
- Need card container? → Use `<Card />` from shadcn/ui
- Need loading state? → Use skeleton loading (prefer skeleton over spinner)
- Need form? → Use `<Form />` components from shadcn/ui with React Hook Form integration
- 💡 **Remember**: All shadcn/ui components are responsive by default - ensure your layouts use responsive Tailwind classes

**Anti-patterns to avoid:**

```tsx
// ❌ WRONG: Custom alert implementation
<div className="rounded-lg bg-accent/50 px-4 py-3">
  <Info size={16} className="text-primary" />
  <span>Some info message</span>
</div>

// ✅ CORRECT: Use appropriate shadcn/ui component or pattern
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>Some info message</AlertDescription>
</Alert>
```

### State Management & Data Fetching

> 🔒 **CRITICAL RULE: ALL server requests (real AND dummy) SHOULD use TanStack Query**
>
> 🚫 **useState is ONLY for UI state, NEVER for server/API data state**

1. **🚨 RECOMMENDED: TanStack Query for ALL Server Operations** (when added):
   - ✅ **RECOMMENDED to use** TanStack Query for ALL server requests:
     - ✅ Real API calls (REST API, Next.js API routes, etc.)
     - ✅ Mock/dummy API calls for testing or development
     - ✅ ANY external API requests (REST, GraphQL, etc.)
     - ✅ ANY asynchronous data fetching from servers
   - ❌ **NEVER use** `useState` to manage server request state (loading, data, error)
   - ❌ **NEVER use** `useEffect` to fetch server data
   - ❌ **NEVER store** API response data in component state
   - 💡 **Why**: TanStack Query provides automatic caching, background updates, request deduplication, and optimistic updates

2. **State Management Hierarchy** (use in this order):
   - **TanStack Query**: For ALL server/API state (queries, mutations, loading, errors, cache) - RECOMMENDED for ANY server data
   - **useState**: For local UI state only (form inputs managed by React Hook Form, toggles, modals, local flags, component-level state)
   - ❌ **NEVER overlap**: Don't use useState for anything TanStack Query should handle
   - 🔒 **Golden Rule**: If data comes from a server (real or mock), use TanStack Query. If it's UI state, use useState.

3. **TanStack Query Patterns** (for ALL server requests):

   ```tsx
   // ✅ CORRECT: Real API query
   const { data, isLoading, error } = useQuery({
     queryKey: ['posts', postId],
     queryFn: async () => {
       const response = await fetch(`/api/posts/${postId}`);
       if (!response.ok) throw new Error('Failed to fetch');
       return response.json();
     },
   });

   // ✅ CORRECT: Mock/dummy API query (still use TanStack Query!)
   const { data, isLoading, error } = useQuery({
     queryKey: ['mock-users'],
     queryFn: async () => {
       // Simulate API delay
       await new Promise((resolve) => setTimeout(resolve, 1000));
       return [
         { id: 1, name: 'John Doe' },
         { id: 2, name: 'Jane Doe' },
       ];
     },
   });

   // ✅ CORRECT: Real API mutation
   const createPost = useMutation({
     mutationFn: async (postData) => {
       const response = await fetch('/api/posts', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(postData),
       });
       if (!response.ok) throw new Error('Failed to create post');
       return response.json();
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['posts'] });
     },
   });

   // ❌ WRONG: Never manage server data with useState
   const [posts, setPosts] = useState([]); // ❌ Don't use useState for API data (real or mock)
   const [loading, setLoading] = useState(false); // ❌ Don't manage loading manually
   useEffect(() => {
     // ❌ Don't use useEffect for data fetching (even for dummy data)
     fetchPosts();
   }, []);
   ```

4. **AVOID unnecessary `useEffect`** - only use when you need to synchronize with external systems:
   - ✅ **Valid uses**: setting up event listeners, syncing with browser APIs, subscribing to WebSocket/real-time
   - ❌ **Avoid**: fetching data (use TanStack Query), transforming data (use `useMemo`), handling events (use event handlers)
   - 💡 **Tip**: If you can calculate something during render, you don't need `useEffect`

### Forms & Validation

> 🔒 **CRITICAL RULE: ALL forms MUST use React Hook Form with Zod validation**
>
> 🚫 **NEVER use `useState` for form state management - use React Hook Form instead**

1. **🚨 STRICT: React Hook Form for ALL Forms** (when forms are added):
   - ✅ **ALWAYS use** React Hook Form (`react-hook-form`) for ALL form handling:
     - ✅ Simple forms (login, registration, search)
     - ✅ Complex forms (multi-step, dynamic fields, arrays)
     - ✅ Forms with validation (synchronous and asynchronous)
     - ✅ Forms with conditional fields
     - ✅ Forms that need to integrate with TanStack Query mutations
   - ✅ **ALWAYS USE Zod** for schema validation - validation is REQUIRED for all forms
   - ❌ **NEVER use** `useState` for form inputs (except for non-form UI state like modals, toggles)
   - ❌ **NEVER use** uncontrolled form inputs
   - 💡 **Why**: React Hook Form provides minimal re-renders, built-in validation, async validation, field-level state management, and seamless integration with shadcn/ui Form components

2. **React Hook Form Patterns** (for ALL forms):

   ```tsx
   // ✅ CORRECT: Using React Hook Form with Zod for form handling
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import * as z from 'zod';
   import {
     Button,
     Input,
     Form,
     FormField,
     FormItem,
     FormLabel,
     FormControl,
     FormMessage,
   } from '@/components/ui';

   const formSchema = z.object({
     title: z.string().min(1, 'Title is required'),
     description: z.string().optional(),
   });

   export function CreatePostForm() {
     const form = useForm<z.infer<typeof formSchema>>({
       resolver: zodResolver(formSchema),
       defaultValues: {
         title: '',
         description: '',
       },
     });

     const onSubmit = async (values: z.infer<typeof formSchema>) => {
       // Handle form submission
       console.log(values);
     };

     return (
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField
             control={form.control}
             name="title"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Title</FormLabel>
                 <FormControl>
                   <Input {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <Button type="submit" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
           </Button>
         </form>
       </Form>
     );
   }

   // ❌ WRONG: Never use useState for form inputs
   const [title, setTitle] = useState(''); // ❌ Don't use useState for form state
   const [description, setDescription] = useState(''); // ❌ Use React Hook Form instead

   // ❌ WRONG: Never use uncontrolled inputs
   <input defaultValue="..." />; // ❌ Use controlled inputs with React Hook Form
   ```

3. **Form Validation Guidelines**:
   - ✅ **USE** Zod schemas for all form validation
   - ✅ **USE** `zodResolver` from `@hookform/resolvers/zod` to integrate Zod with React Hook Form
   - ✅ **USE** `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` from shadcn/ui for consistent form UI
   - ✅ **DISPLAY** field errors using `FormMessage` component
   - ✅ **HANDLE** async validation using Zod's async refinement
   - ✅ **ALWAYS** provide clear error messages to users

4. **Form Submission with TanStack Query**:
   - ✅ **INTEGRATE** form submission with TanStack Query mutations
   - ✅ **USE** `form.formState` to access form state (isSubmitting, errors)
   - ✅ **HANDLE** submission errors and display them in the form
   - ✅ **INVALIDATE** queries after successful form submission

   ```tsx
   // ✅ CORRECT: Form submission with TanStack Query mutation
   const createPost = useMutation({
     mutationFn: async (postData) => {
       const response = await fetch('/api/posts', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(postData),
       });
       if (!response.ok) throw new Error('Failed to create post');
       return response.json();
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['posts'] });
       router.push('/posts');
     },
   });

   const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues: { title: '', description: '' },
   });

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
     await createPost.mutateAsync(values);
   };
   ```

5. **Anonymous profile persistence (client-only)**:
   - ✅ Use the `useUserProfile` hook (Zustand) for anonymous profile state.
   - ✅ Persist anonymous profiles to `localStorage` with key `mitsors_user_profile` via `setAnonymousProfile`.
   - ✅ Hydrate the store on load; keep this client-only (no API or DB calls).
   - ❌ Do not use TanStack Query for this local-only profile persistence.

5. **Best Practices**:
   - ✅ **ALWAYS** provide `defaultValues` for all form fields
   - ✅ **ALWAYS** validate form inputs before submission using Zod
   - ✅ **ALWAYS** handle form submission errors and display them to users
   - ✅ **ALWAYS** disable submit button when form is invalid or submitting
   - ✅ **PREFER** async validation with Zod for API-based validation
   - ✅ **USE** semantic error messages that help users fix the issue
   - ✅ **INTEGRATE** with shadcn/ui Form components for consistent UI
   - ❌ **AVOID** validating on every keystroke for expensive validations (use debouncing)
   - 💡 **Rule**: If it's user input that needs validation or submission, use React Hook Form with Zod

### Component & File Conventions

1. **USE** `.tsx` extension for components (TypeScript + JSX)
2. **PREFER** functional components with React hooks
3. **USE** `export default` for page components in Next.js App Router
4. **USE** `kebab-case` for all file and folder names:
   - Component files: `button.tsx`, `user-form.tsx`
   - Hook files: `use-user-data.ts`
   - Utility files: `utils.ts`
   - Folder names: `components/`, `app/`
5. **USE** `PascalCase` for component names in code:
   - Export: `export function Button() { ... }`
   - Import/Usage: `<Button />`, `<UserForm />`
6. **IMPORT PATH GUIDELINES**:
   - ✅ **Root-level shared code**: Use absolute imports with `@/` alias
     - `import { Button } from '@/components/ui/button'`
     - `import { cn } from '@/lib/utils'`
     - `import { useSharedHook } from '@/hooks/use-shared-hook'`
   - ✅ **Route-level modular code**: Use relative imports within the route
     - `import { RouteComponent } from './components/route-component'`
     - `import { useRouteData } from './hooks/use-route-data'`
     - `import { routeConfig } from './constants/route-config'`
   - ❌ **Avoid**: Relative imports that go up multiple levels
     - ❌ `import { Button } from '../../components/ui/button'` (use `@/components/ui/button` instead)

### Props & TypeScript

1. **ALWAYS** define prop types using TypeScript interfaces or types
2. **PREFER** destructuring props in function parameters
3. **USE** shared types when available

```tsx
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  // component logic
}
```

### UI & Styling

16. **USE Tailwind CSS** for styling via the `className` prop
17. **USE Radix UI** primitives for accessible components
18. **USE shadcn/ui** components (built on Radix UI) for common UI patterns
19. **USE Lucide React** for all icons (see Icon System section above)
20. **PREFER** Tailwind utility classes over inline styles
21. **USE** `cn()` utility function (from `lib/utils.ts`) for conditional class names
22. **USE semantic colors** from the design system (see Styling System section above)
23. **🚨 CRITICAL: ALL UI MUST BE RESPONSIVE BY DEFAULT**:
    - ✅ **ALWAYS** use responsive Tailwind classes (e.g., `sm:`, `md:`, `lg:`, `xl:`, `2xl:`) for all UI components
    - ✅ **ALWAYS** ensure shadcn/ui components are responsive by default (they are built with responsive design in mind)
    - ✅ **ALWAYS** test UI on multiple screen sizes (mobile, tablet, desktop)
    - ✅ **USE** responsive utilities like `flex-col md:flex-row`, `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
    - ✅ **USE** responsive typography with `text-sm md:text-base lg:text-lg`
    - ✅ **USE** responsive spacing with `p-4 md:p-6 lg:p-8`
    - ❌ **NEVER** create fixed-width layouts that break on smaller screens
    - ❌ **NEVER** use pixel-based widths without responsive alternatives
    - 💡 **Best Practice**: Mobile-first approach - design for mobile, then enhance for larger screens
24. **⭐ ALWAYS PREFER skeleton loading** over circle/spinner loading for better UX:
    - ✅ Skeleton loading provides visual context and reduces perceived wait time
    - ✅ Use skeleton components for content loading states
    - ❌ Avoid circle/spinner loading unless it's for very brief operations (<500ms)
    - 💡 Users prefer seeing the layout structure while content loads

### Code Quality

25. **FOLLOW** ESLint rules (configured with Next.js config)
26. **USE** Prettier for code formatting
27. **USE** single quotes for strings (Prettier config)
28. **PREFER** meaningful variable and function names
29. **SPLIT** large components (>300 lines) into smaller components in the same folder
    - Example: `edit-form.tsx` → `edit-form-header.tsx`, `edit-form-body.tsx`
30. **USE** TypeScript strict mode
31. **AVOID** `any` type - use proper types or `unknown`
32. **UPDATE** relevant `AGENTS.md` files whenever code structure, patterns, or conventions change (see [Documentation Maintenance](#-documentation-maintenance))
33. **🚨 CRITICAL: Calculation Logic Verification**:
    - ✅ **ALWAYS** run `bun run test:calc` after making changes to calculation logic
    - ✅ **ALWAYS** verify calculation changes don't break expected results
    - ✅ **REQUIRED** for changes in any calculation-related code
    - 💡 **Why**: Ensures calculations remain accurate and consistent

### Routing (Next.js App Router)

34. **USE Next.js App Router** file-based routing in `/app/` directory
35. **USE** `layout.tsx` for shared layouts
36. **USE** dynamic routes with `[param]` folders and `page.tsx` files
37. **USE** route groups with `(group)` folders for layout organization
38. **IMPORT** from `next/navigation` for navigation:
    - `useRouter()` for programmatic navigation
    - `useSearchParams()` for query parameters
    - `usePathname()` for current pathname
    - `Link` component for declarative navigation

### API & Services

39. **USE** TanStack Query hooks for ALL API operations (when added)
40. **CREATE** custom hooks following modular pattern:
    - ✅ **Shared hooks**: Place in root `/hooks/` for hooks used across multiple routes
    - ✅ **Route-specific hooks**: Place in `app/[route]/hooks/` for hooks only used in that route
    - 💡 **Pattern**: Export custom hooks like `usePosts()`, `usePost(id)`, `useCreatePost()`
41. **USE** environment variables for API configuration
42. **API Routes**: Use Next.js API routes for server-side endpoints when needed
    - ✅ Place API routes in `app/api/[endpoint]/route.ts`
    - ✅ Export named functions (`GET`, `POST`, `PUT`, `DELETE`, etc.)
43. **DATABASE OPERATIONS**:
    - ✅ **ALWAYS** use Drizzle ORM for database operations (see [Database & ORM](#️-database--orm))
    - ✅ **ALWAYS** import database instance from `@/lib/db`
    - ✅ **ALWAYS** import schema tables from `@/lib/db/schema`
    - ✅ **ALWAYS** use TypeScript types from schema (`Post`, `NewPost`, etc.)
    - ✅ **ALWAYS** handle errors with try-catch blocks in API routes
    - ✅ **ALWAYS** validate request data before database operations

### Environment & Configuration

44. **USE** environment variables in `.env` files
45. **NEVER** commit `.env` with sensitive keys (use `.env.local` or secure secrets management)
46. **PREFIX** public environment variables appropriately:
    - Next.js: `NEXT_PUBLIC_*` for client-side variables
    - Server-side: Standard naming for server-side variables (e.g., `DATABASE_URL`)
47. **Webpack resolve fallback**: The project sets a webpack `resolve.modules` entry to the app's `node_modules` in `next.config.ts` to ensure CSS imports like `@import "tailwindcss"` resolve correctly even if a process starts with the wrong working directory. Prefer running tasks with cwd at the app root (`mitsors-web`).

### Error Handling

47. **ALWAYS** handle errors gracefully
48. **PROVIDE** user-friendly error messages
49. **LOG** errors appropriately (server-side logging)
50. **USE** TanStack Query error states for API errors (when using TanStack Query)
51. **DISPLAY** error states in UI (error boundaries, toast notifications)

### Performance

52. **USE** Next.js Image component for images
53. **IMPLEMENT** code splitting with dynamic imports
54. **OPTIMIZE** bundle size (check with `bun run build`)
55. **USE** React.memo for expensive components (when needed)
56. **USE** useMemo and useCallback appropriately (avoid premature optimization)
57. **MONITOR** bundle size and performance metrics

### Testing (When Applicable)

58. **WRITE** tests for critical business logic
59. **USE** appropriate testing frameworks (Jest, React Testing Library)
60. **TEST** API endpoints and services
61. **MAINTAIN** test coverage for shared utilities
62. **🚨 CRITICAL: Calculation Verification**:
    - ✅ **ALWAYS** run `bun run test:calc` before committing changes to calculation logic
    - ✅ **REQUIRED** when modifying:
      - Business logic calculations
      - Data processing algorithms
      - Financial calculations (if applicable)
      - Time-based calculations
      - Statistical computations
    - ✅ The verification test ensures calculations match expected results from production data
    - 💡 **Command**: `bun run test:calc` (or `node test-calculation-verification.js`)

---

## 📚 Additional Resources

- **Next.js Documentation**: <https://nextjs.org/docs>
- **Tailwind CSS**: <https://tailwindcss.com/docs>
- **Radix UI**: <https://www.radix-ui.com/>
- **shadcn/ui**: <https://ui.shadcn.com/>
- **Lucide Icons**: <https://lucide.dev/icons>
- **Bun**: <https://bun.sh/docs>
- **Conventional Commits**: <https://www.conventionalcommits.org/>
- **Semantic Release**: <https://semantic-release.gitbook.io/>

---

## 🎯 Quick Reference

### Common Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Lint code
bun run lint

# Test calculation logic
bun run test:calc      # Verify calculation logic (REQUIRED after calculation changes)

# Database commands
bun run db:generate    # Generate migration files from schema
bun run db:migrate     # Run pending migrations
bun run db:push        # Push schema changes directly (development)
bun run db:studio      # Open Drizzle Studio (database GUI)
```

### Ports

- **Web**: <http://localhost:3000>
- **Drizzle Studio**: <http://localhost:4983> (when running `db:studio`)

### Key Directories

- `app/` - Next.js App Router routes and pages
- `app/api/` - API routes (Next.js API endpoints)
- `components/` - Shared React components
- `lib/` - Utility functions
- `lib/db/` - Database connection and schema
- `drizzle/` - Generated migration files
- `public/` - Static assets (images, fonts, icons)

---

> 🧠 This document provides comprehensive context and guidelines for the MITSORS Web project. Keep it updated as the project evolves!
