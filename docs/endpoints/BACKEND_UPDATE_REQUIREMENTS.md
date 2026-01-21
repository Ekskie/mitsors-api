# Backend Update Requirements

## Overview
This document outlines the required updates to the backend API to support all livestock types, breeds, regions, and cities/municipalities that are available in the frontend application.

## 1. Livestock Types

### Current Backend Support
```typescript
type LivestockType = 'fattener' | 'piglet' | 'both';
```

### Required Update
The backend should accept all of the following livestock types:

```typescript
type LivestockType = 'fattener' | 'piglet' | 'breeder' | 'gilt' | 'boar' | 'sow' | 'both';
```

**Livestock Type Definitions:**
- `fattener` - Pigs raised specifically for meat production
- `piglet` - Young pigs, typically weaned
- `breeder` - Breeding stock (general category)
- `gilt` - Young female pig that has not yet farrowed
- `boar` - Male breeding pig
- `sow` - Female pig that has farrowed
- `both` - Mixed category (Fattener & Piglet)

### API Endpoint Update Required
**Endpoint:** `POST /api/v1/prices/submit`

**Request Body Field:**
```json
{
  "livestockType": "breeder"  // Should accept all 7 types listed above
}
```

---

## 2. Pig Breeds

### Current Status
The frontend supports 60+ pig breeds, but backend validation may need to be updated.

### Required Breeds List

**Commercial Breeds:**
- Large White
- Landrace
- Duroc
- Hampshire
- Yorkshire
- Berkshire
- Chester White
- Poland China
- Spotted
- Pietrain

**Hybrid Lines:**
- LY (Landrace x Yorkshire)
- DLY (Duroc x Landrace x Yorkshire)
- PIC (Pig Improvement Company)
- Hypor
- Topigs
- Fast Genetics
- Genus

**Asian/Local Breeds:**
- Native (Philippine Native)
- Korobuta (Berkshire-based)
- Meishan
- Jinhua
- Vietnamese Potbelly
- Mangalitsa
- Iberian

**Crossbreeds:**
- Duroc x Large White
- Hampshire x Duroc
- Berkshire x Hampshire
- Landrace x Duroc
- Yorkshire x Duroc
- Large White x Landrace
- Chester White x Duroc
- Poland China x Hampshire
- Spotted x Large White
- Pietrain x Duroc
- Pietrain x Large White
- Hampshire x Large White
- Berkshire x Large White
- Yorkshire x Landrace
- Duroc x Berkshire
- Hampshire x Yorkshire
- Chester White x Hampshire
- Poland China x Duroc
- Spotted x Hampshire
- Pietrain x Yorkshire
- Large White x Chester White
- Landrace x Hampshire
- Duroc x Chester White
- Yorkshire x Chester White
- Berkshire x Landrace
- Hampshire x Landrace
- Poland China x Large White
- Spotted x Duroc
- Pietrain x Landrace
- Chester White x Large White
- Duroc x Spotted
- Yorkshire x Berkshire
- Large White x Poland China
- Landrace x Chester White
- Hampshire x Chester White
- Berkshire x Duroc
- Poland China x Yorkshire
- Spotted x Landrace
- Pietrain x Hampshire
- Chester White x Berkshire
- Duroc x Poland China

**Other:**
- Others (catch-all for unlisted breeds)

### Validation Requirement
Backend should accept any string up to 100 characters for the `breed` field to accommodate all breeds and custom entries.

---

## 3. Philippine Regions

### Required Regions (17 Total)

The backend must accept all Philippine regions as defined by the Philippine Statistics Authority (PSA):

1. **NCR** - National Capital Region
2. **CAR** - Cordillera Administrative Region
3. **Region I** - Ilocos Region
4. **Region II** - Cagayan Valley
5. **Region III** - Central Luzon
6. **Region IV-A** - CALABARZON
7. **Region IV-B** - MIMAROPA
8. **Region V** - Bicol Region
9. **Region VI** - Western Visayas
10. **Region VII** - Central Visayas
11. **Region VIII** - Eastern Visayas
12. **Region IX** - Zamboanga Peninsula
13. **Region X** - Northern Mindanao
14. **Region XI** - Davao Region
15. **Region XII** - SOCCSKSARGEN
16. **Region XIII** - Caraga
17. **BARMM** - Bangsamoro Autonomous Region in Muslim Mindanao

### Database Schema Recommendation
```typescript
{
  region: {
    type: String,
    required: true,
    enum: [
      'National Capital Region',
      'Cordillera Administrative Region',
      'Ilocos Region',
      'Cagayan Valley',
      'Central Luzon',
      'CALABARZON',
      'MIMAROPA',
      'Bicol Region',
      'Western Visayas',
      'Central Visayas',
      'Eastern Visayas',
      'Zamboanga Peninsula',
      'Northern Mindanao',
      'Davao Region',
      'SOCCSKSARGEN',
      'Caraga',
      'Bangsamoro Autonomous Region in Muslim Mindanao'
    ]
  }
}
```

---

## 4. Cities and Municipalities

### Overview
The frontend includes **1,600+ cities and municipalities** across all 17 Philippine regions, organized according to the Philippine Standard Geographic Code (PSGC).

### Data Structure Example

```typescript
{
  regionCode: 'NCR',
  regionName: 'National Capital Region',
  cities: [
    'Caloocan City',
    'Las Piñas City',
    'Makati City',
    'Malabon City',
    'Mandaluyong City',
    'Manila',
    'Marikina City',
    'Muntinlupa City',
    'Navotas City',
    'Parañaque City',
    'Pasay City',
    'Pasig City',
    'Pateros',
    'Quezon City',
    'San Juan City',
    'Taguig City',
    'Valenzuela City'
  ]
}
```

### Complete Cities/Municipalities Data

The complete list of all 1,600+ cities and municipalities is available in:
```
/constants/philippine-locations.ts
```

This file contains:
- All 17 regions with their respective region codes
- Complete list of cities and municipalities for each region
- Accurate PSGC-compliant naming

### Backend Validation Requirement

**Option 1: Strict Validation (Recommended)**
- Import and use the same `philippine-locations.ts` data in the backend
- Validate that submitted city/municipality exists within the submitted region
- Return validation error if city doesn't match region

**Option 2: Flexible Validation**
- Accept any string for city/municipality (max 100 characters)
- Store as-is without validation
- Add data quality checks in post-processing

### Recommended Implementation

1. **Copy the data file to backend:**
   ```bash
   cp constants/philippine-locations.ts backend/src/constants/
   ```

2. **Create validation function:**
   ```typescript
   import { regions } from './constants/philippine-locations';
   
   export function validateCityInRegion(regionName: string, cityName: string): boolean {
     const region = regions.find(r => r.name === regionName);
     if (!region) return false;
     return region.cities.includes(cityName);
   }
   ```

3. **Use in API validation:**
   ```typescript
   if (!validateCityInRegion(body.region, body.city)) {
     return res.status(400).json({
       error: 'Invalid city for the specified region'
     });
   }
   ```

---

## 5. API Endpoint Updates Summary

### POST /api/v1/prices/submit

**Updated Request Body Type:**
```typescript
{
  region: string;                    // Must be one of 17 Philippine regions
  city: string;                      // Must be valid city/municipality in region
  pricePerKg: number;                // Min: 50, Max: 500
  livestockType?: 'fattener' | 'piglet' | 'breeder' | 'gilt' | 'boar' | 'sow' | 'both';
  breed?: string;                    // Max 100 characters, accepts all breeds
  notes?: string;                    // Max 500 characters
  dateObserved?: string;             // YYYY-MM-DD format
}
```

**Updated Validation Rules:**
1. `region` - Must match one of 17 region names exactly
2. `city` - Must be valid city/municipality within the specified region
3. `livestockType` - Accept 7 types instead of 3
4. `breed` - Accept any string up to 100 characters
5. `notes` - Max 500 characters (if provided, minimum 10 characters)

---

## 6. Database Schema Updates

### Prices Collection/Table

**Required Updates:**

```typescript
// Before
livestockType: {
  type: String,
  enum: ['fattener', 'piglet', 'both']
}

// After
livestockType: {
  type: String,
  enum: ['fattener', 'piglet', 'breeder', 'gilt', 'boar', 'sow', 'both'],
  required: false
}
```

### Migration Steps

1. **Add new enum values** to `livestockType` field
2. **Test with sample data** for each new livestock type
3. **Update API documentation** to reflect new accepted values
4. **Update validation middleware** to accept new types

---

## 7. Testing Checklist

### Livestock Types
- [ ] Test submission with `breeder`
- [ ] Test submission with `gilt`
- [ ] Test submission with `boar`
- [ ] Test submission with `sow`
- [ ] Verify existing `fattener`, `piglet`, `both` still work

### Regions
- [ ] Test all 17 regions individually
- [ ] Test region name variations (with/without "Region" prefix)
- [ ] Test invalid region names (should reject)

### Cities/Municipalities
- [ ] Test at least 5 cities from each region
- [ ] Test city-region mismatch (should reject if using strict validation)
- [ ] Test cities with special characters (e.g., "Parañaque", "Dasmariñas")

### Breeds
- [ ] Test common breeds (Large White, Landrace, Duroc)
- [ ] Test hybrid breeds (DLY, LY, PIC)
- [ ] Test crossbreeds with "x" notation
- [ ] Test "Others" category
- [ ] Test custom breed strings

---

## 8. Frontend Data Source

All frontend data is maintained in these files:

1. **Livestock Types & Breeds:**
   ```
   /constants/livestock-data.ts
   ```

2. **Philippine Locations (Regions & Cities):**
   ```
   /constants/philippine-locations.ts
   ```

### Keeping Frontend-Backend in Sync

**Recommendation:** Use a shared constants package or copy these files to the backend to ensure both systems use identical data.

**Alternative:** Create a separate shared npm package:
```bash
@mitsors/shared-constants
  - livestock-data.ts
  - philippine-locations.ts
```

Then import in both frontend and backend:
```typescript
import { regions, getCityOptions } from '@mitsors/shared-constants';
```

---

## 9. Implementation Priority

### Phase 1 (Critical)
1. Update `livestockType` enum to include all 7 types
2. Update region validation to accept all 17 regions
3. Update API documentation

### Phase 2 (Important)
1. Implement city-region validation
2. Add all 1,600+ cities to backend validation
3. Update database schema

### Phase 3 (Enhancement)
1. Create shared constants package
2. Add data quality checks
3. Add autocomplete suggestions API
4. Add data analytics for submitted prices

---

## 10. Contact & Questions

For questions about this specification or the frontend data structure:
- Check the frontend codebase: `/constants/` directory
- Review API documentation: `/docs/endpoints/`
- Test with the frontend form at `http://localhost:5000`

---

**Last Updated:** January 10, 2026
**Version:** 1.0
**Status:** Pending Backend Implementation
