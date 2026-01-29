# Mitsors Web

## Run

Development server runs on http://localhost:5000

```
npm install
npm run dev
```

Production start on port 5000 after build:

```
npm run build
npm run start
```

## API Integration

- Recommended (dev, backend on localhost:3000): set `API_BASE_URL` only. Requests to `/api/v1/*` are proxied, preserving same-origin cookies.
- Alternative: set `NEXT_PUBLIC_API_BASE_URL` for direct cross-origin calls. Use this only if you specifically want to bypass the proxy.
 - Toggle: set `NEXT_PUBLIC_USE_PROXY=true` to force proxy mode even if `NEXT_PUBLIC_API_BASE_URL` is set (client will use relative `/api/v1/*`).

Example `.env.local` (recommended dev):

```
API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_USE_PROXY=true
```

Example `.env.local` (direct calls):

```
NEXT_PUBLIC_API_BASE_URL=https://api.mitsors.com
NEXT_PUBLIC_USE_PROXY=false
```

## Implemented Features

### Landing Page
- **Navigation Bar**: Header with MITSORS logo, Home/Dashboard links, and theme toggle button
- **Price Ticker**: Real-time scrolling ticker displaying livestock prices for different regions (e.g., "Region III: ₱100.00/kg - 0.00%")
- **Hero Section**: 
  - Large headline: "Real-Time Livestock Prices"
  - Descriptive subtitle about platform capabilities
  - Two CTA buttons: "Check Prices" and "Learn More"
  - Trust indicators: Verified Data, Nationwide Coverage, Real-Time Updates badges
- **Feature Cards Grid**: Four highlighted features with icons:
  - **Live Prices**: Access real-time pricing data from markets across the Philippines
  - **Regional Insights**: Compare prices across different regions to find the best deals
  - **Market Trends**: Analyze historical data and predict future price movements
  - **Verified Data**: Trust in community-verified pricing information
- **Footer**: MITSORS branding with Product, Support, and Legal sections containing relevant links
- **Light/Dark Mode**: Theme toggle in navbar with smooth transitions between themes

### Dashboard
- **Theme Toggle**: Light/dark mode switcher in header with smooth transitions
- **Regional Price Cards**: Displays "Verified Trader Average" and "Unverified User Average" for selected region/city with semantic colors, loading skeletons, and "No data available" fallback
- **Regional Price Overview Table**: Shows livestock prices across all Philippine regions with:
  - Region names with visual indicators (green dot for user's region)
  - Verified and Unverified average prices
  - Sample counts for each price type
  - Last updated timestamps
  - Responsive layout with proper spacing
- **Submit Price Modal**: React Hook Form + Zod validation with fields:
  - Region (dropdown with all Philippine regions)
  - City/Municipality (dynamic dropdown based on selected region)
  - Livestock Type (Boar, Breeder, Fattener, Gilt, Piglet, Sow)
  - Breed (optional: American Landrace, Belgian Landrace, Berkshire, British Landrace, British Saddleback, Chester White, Choice Genetics, Crossbred (Mixed), DLY, etc.)
  - Price (PHP/kg) with validation (50–500 PHP)
  - Date Observed (defaults to today, cannot be in future)
  - Notes (optional, max 500 chars)

### Technical Features
- **Mutation + Cache**: TanStack Query `useMutation` with query invalidation on success
- **Toast System**: Global provider and UI with success/error/info feedback
- **Flexible API Client**: `lib/api/client.ts` with proxy/direct toggle, JSON handling, cookies, and optional Bearer token
- **DTO Types**: `lib/api/types.ts` aligned with backend API responses
- **Proxy Rewrites**: `next.config.ts` forwards `/api/v1/*` to `API_BASE_URL` for same-origin dev
- **Dev Port**: Scripts run the app on http://localhost:5000
- **Color Theme**: Tailwind 4 CSS-based theme with semantic colors optimized for both light and dark modes
- **Philippine Locations Data**: Complete region and city/municipality mappings in `constants/philippine-locations.ts`
- **Livestock Data**: Livestock types and breeds in `constants/livestock-data.ts`

## Notes

- Restart dev server after changing `.env.local` or theme files.
- Backend dev origin is http://localhost:3000; use proxy mode for CORS-free cookies.


# UI Flow Descriptions

## Dashboard Overview
- **Header**: 
  - Title: "Dashboard"
  - Subtitle: "Monitor liveweight prices in your region"
  - Theme toggle button (light/dark mode)
  - "Submit Price" button (top-right)
- **Price Cards Section**:
  - Two side-by-side cards showing regional averages
  - **Verified Trader Average**: Shows average price from verified traders with check icon
  - **Unverified User Average**: Shows average price from unverified users with user icon
  - Both cards display: Region • City, Price (₱/kg), sample count, and last updated date
  - Loading states use skeleton components
  - "No data available" shown when no prices exist
- **Market Overview Section**:
  - **Regional Price Overview Table**:
    - Header: "Liveweight prices across all 2 Philippine regions • Your region: Region III"
    - Columns: Region, Verified Avg, Sample, Unverified Avg, Sample, Last Updated
    - User's current region highlighted with green dot indicator
    - Shows "—" for missing data, "0" for zero samples
    - Displays count summary: "2 of 2 regions with data"
- **Theme Support**: Full dark mode with proper color transitions and semantic colors

## Submit Price Modal
- **Trigger**: Click "Submit Price" button in dashboard header
- **Modal Title**: "Submit Liveweight Price"
- **Form Fields**:
  1. **Region**: Searchable dropdown (combobox) with all Philippine regions:
     - Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)
     - Cordillera Administrative Region (CAR)
     - MIMAROPA - Southwestern Tagalog Region
     - National Capital Region (NCR)
     - Region I - Ilocos Region
     - Region II - Cagayan Valley
     - Region III - Central Luzon
     - Region IV-A - CALABARZON
     - And more...
  2. **City/Municipality**: Dynamic searchable dropdown based on selected region:
     - Automatically updates when region changes
     - Shows cities like: Akbar, Al-Barka, Ampatuan, Bacolod-Kalawi, Balabagan, Balindong, Barira, Bayang, Binidayan, etc.
  3. **Livestock Type**: Select dropdown with options:
     - Boar
     - Breeder
     - Fattener
     - Gilt
     - Piglet
     - Sow
  4. **Breed** (optional): Searchable dropdown with pig breeds:
     - American Landrace
     - Belgian Landrace
     - Berkshire
     - British Landrace
     - British Saddleback
     - Chester White
     - Choice Genetics
     - Crossbred (Mixed)
     - DLY (Duroc x Landrace x Yorkshire)
     - And more...
  5. **Price (PHP/kg)**: Number input with validation (50–500 PHP)
  6. **Date Observed**: Date picker (defaults to today, cannot be in future)
  7. **Notes** (optional): Textarea, max 500 characters
- **Actions**: "Cancel" and "Submit" buttons
- **Validation**: React Hook Form + Zod schema
- **Submission**: Uses TanStack Query mutation, shows toast on success/error
- **Code mapping**:
  - Modal component: `app/components/submit-price-modal.tsx`
  - Mutation hook: `hooks/use-submit-price.ts`
  - Form components: `components/ui/form.tsx`, `components/ui/combobox.tsx`, `components/ui/select.tsx`

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
3. Open Dashboard at `http://localhost:5000`:
   - View regional price cards for your region (defaults to Region III • Angeles)
   - Browse the Regional Price Overview table showing all regions
   - Toggle between light and dark mode using the theme button
4. Click **Submit Price** button in the header.
5. Fill the form:
   - Select Region from dropdown (searchable)
   - Select City/Municipality (updates based on region)
   - Select Livestock Type (Boar, Breeder, Fattener, Gilt, Piglet, or Sow)
   - Optionally select Breed (e.g., American Landrace, Berkshire, Crossbred)
   - Enter Price (50–500 PHP)
   - Select or keep default Date Observed
   - Optionally add Notes
6. Click **Submit** and observe success toast.
7. Confirm the new entry in the database (`price_inputs`).
8. Verify the dashboard updates with the new price data.

## Notes
- Color theme uses semantic tokens configured in `app/globals.css` for both light and dark modes.
- Dark mode is fully supported across all components with smooth transitions.
- All server interactions are via TanStack Query; UI-only state uses React hooks.
- Regional price table shows real-time data from all Philippine regions.
- Form dropdowns are searchable for better UX with large datasets.
- Livestock types and breeds are managed in `constants/livestock-data.ts`.
- Philippine regions and cities are managed in `constants/philippine-locations.ts`.

