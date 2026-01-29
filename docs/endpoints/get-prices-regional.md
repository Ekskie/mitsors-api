# GET /api/prices/regional

## Description

Get comprehensive price data for all Philippine regions, showing verified and unverified averages for each region.

## Authentication

Optional - Can be accessed by both anonymous and authenticated users.

## Request

### Method

`GET`

### Path

`/api/prices/regional`

### Query Parameters

| Parameter | Type   | Required | Description                                                                        |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| `sort`    | string | No       | Sort by: `region` (default), `verifiedAverage`, `unverifiedAverage`, `lastUpdated` |
| `order`   | string | No       | Sort order: `asc` (default) or `desc`                                              |
| `search`  | string | No       | Filter by region name (case-insensitive partial match)                             |

### Example Request

```
GET /api/prices/regional?sort=verifiedAverage&order=desc
GET /api/prices/regional?search=NCR
```

## Response

### Success Response (200 OK)

```json
{
  "regions": [
    {
      "region": "NCR (National Capital Region)",
      "verifiedAverage": 190.25,
      "unverifiedAverage": 188.5,
      "priceChange": null,
      "lastUpdated": "2025-01-15T10:30:00Z",
      "verifiedSampleSize": 45,
      "unverifiedSampleSize": 120
    },
    {
      "region": "Region III (Central Luzon)",
      "verifiedAverage": 185.5,
      "unverifiedAverage": 182.3,
      "priceChange": null,
      "lastUpdated": "2025-01-15T09:15:00Z",
      "verifiedSampleSize": 23,
      "unverifiedSampleSize": 67
    }
  ],
  "totalRegions": 18,
  "regionsWithData": 15
}
```

### Response Fields

- `regions` (array): Array of region price data objects
  - `region` (string): Philippine region name
  - `verifiedAverage` (number | null): Average price from verified traders (PHP/kg), null if no data
  - `unverifiedAverage` (number | null): Average price from unverified users (PHP/kg), null if no data
  - `priceChange` (number | null): Percentage change from previous period (reserved for future use)
  - `lastUpdated` (string): ISO 8601 timestamp of most recent price input in this region
  - `verifiedSampleSize` (number): Number of verified price inputs in this region
  - `unverifiedSampleSize` (number): Number of unverified price inputs in this region
- `totalRegions` (number): Total number of Philippine regions
- `regionsWithData` (number): Number of regions that have at least one price input

### Empty State Response (200 OK)

When no price data exists for any region:

```json
{
  "regions": [],
  "totalRegions": 18,
  "regionsWithData": 0,
  "message": "No price data available"
}
```

### Error Responses

#### 400 Bad Request - Invalid Sort Parameter

```json
{
  "statusCode": 400,
  "message": "Invalid sort parameter. Allowed values: region, verifiedAverage, unverifiedAverage, lastUpdated",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Invalid Order Parameter

```json
{
  "statusCode": 400,
  "message": "Invalid order parameter. Allowed values: asc, desc",
  "error": "Bad Request"
}
```

## Features

- Sortable by region name, verified average, unverified average, or last updated timestamp
- Searchable by region name (case-insensitive partial match)
- Default sort: By region name (alphabetical)
- Real-time data from database
- Regions without price data show null averages but are still included in response

## Caching

- Cache duration: 5 minutes
- Cache invalidation: Updates after new price submissions
- Manual refresh: Pull-to-refresh supported on client
