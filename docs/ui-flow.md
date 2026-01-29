# UI Flow Descriptions

This document describes the four screenshots and how they map to the current implementation.

## Submit Button (Dashboard)
- Location: Center of the Dashboard view.
- Style: Emerald primary button using semantic color `bg-primary` and `text-primary-foreground`.
- Behavior: Clicking opens the "Submit Liveweight Price" modal.
- Code mapping:
  - Dashboard entry: app/page.tsx
  - Button component: components/ui/button.tsx (variant `default`)
  - Modal component: app/components/submit-price-modal.tsx (trigger via `DialogTrigger`)

## Filling the Submit Price Form
- Prefill: `Region III` and `Angeles City` from mocked profile via `useUserProfile()`.
- Fields:
  - `Price (PHP/kg)`: number, validated 50–500 PHP.
  - `Livestock Type`: select enum (fattener, piglet, both).
  - `Breed` (optional): text, max 100 chars.
  - `Date Observed`: defaults to today; cannot be in the future.
  - `Notes` (optional): text, max 500 chars.
- Validation: React Hook Form + Zod schema in app/components/submit-price-modal.tsx.
- Submission: Calls TanStack Query mutation (`useSubmitPrice`) and passes DTO.
- Code mapping:
  - Form + validation: app/components/submit-price-modal.tsx
  - Mutation hook: hooks/use-submit-price.ts
  - DTO types: lib/api/types.ts

## Notification (Toast)
- Location: Bottom overlay.
- Style: Success toast with green accent and check icon (Lucide).
- Behavior: Shown after a successful submission; auto-dismiss with manual close option.
- Code mapping:
  - Toast provider and hook: hooks/use-toast.tsx
  - Toast UI: components/ui/toast.tsx
  - Provider wiring: app/providers.tsx (renders `Toaster` globally)

## Database View (Price Inputs)
- Table: `price_inputs` (Neon/Postgres via Drizzle).
- Shown fields: id, userId, verification status, region, city, price_per_kg, livestock_type, breed, notes, date_observed, created_at, updated_at.
- Behavior: New row appears immediately after submission.
- Backend: Implemented in the separate `mitsor-api` repository; frontend uses `/api/v1/prices/submit`.
- Code mapping (frontend):
  - API client: lib/api/client.ts (proxy/direct toggle, auth, JSON)
  - Proxy rewrites: next.config.ts (`API_BASE_URL`)

## Reproduction Steps
1. Start backend at `http://localhost:3000` and frontend at `http://localhost:5000`.
2. Ensure `.env.local` has `API_BASE_URL=http://localhost:3000` and `NEXT_PUBLIC_USE_PROXY=true`.
3. Open Dashboard and click **Submit Price**.
4. Fill the form (valid price: 50–500 PHP) and click **Submit**.
5. Observe success toast and confirm the new entry in the database (`price_inputs`).

## Notes
- Color theme uses semantic tokens with emerald primary configured in app/globals.css and tailwind.config.ts.
- All server interactions are via TanStack Query; UI-only state uses React hooks.
