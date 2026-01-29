# GET /api/prices/aggregated

## Description

Get verified and unverified average liveweight prices for a specific region and city.

## Authentication

Optional - Can be accessed by both anonymous and authenticated users.

## Request

### Method

`GET`

### Path

`/api/prices/aggregated`

### Query Parameters

| Parameter | Type   | Required | Description                                          |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `region`  | string | Yes      | Philippine region name (e.g., "Region III", "NCR")   |
| `city`    | string | Yes      | City or municipality name within the selected region |

### Example Request

```
GET /api/prices/aggregated?region=Region III&city=Angeles City
```

## Response

### Success Response (200 OK)

```json
{
  "verifiedAverage": {
    "pricePerKg": 185.5,
    "sampleSize": 15,
    "lastUpdated": "2025-01-15T10:30:00Z"
  },
  "unverifiedAverage": {
    "pricePerKg": 182.3,
    "sampleSize": 42,
    "lastUpdated": "2025-01-15T10:25:00Z"
  },
  "region": "Region III",
  "city": "Angeles City"
}
```

### Response Fields

- `verifiedAverage.pricePerKg` (number): Average price from verified traders in PHP per kilogram
- `verifiedAverage.sampleSize` (number): Number of verified price inputs included in calculation
- `verifiedAverage.lastUpdated` (string): ISO 8601 timestamp of most recent verified price input
- `unverifiedAverage.pricePerKg` (number): Average price from unverified users in PHP per kilogram
- `unverifiedAverage.sampleSize` (number): Number of unverified price inputs included in calculation
- `unverifiedAverage.lastUpdated` (string): ISO 8601 timestamp of most recent unverified price input
- `region` (string): Region name
- `city` (string): City/municipality name

### No Data Response (200 OK)

When no price data is available for the specified location:

```json
{
  "verifiedAverage": null,
  "unverifiedAverage": null,
  "region": "Region III",
  "city": "Angeles City",
  "message": "No data available for this location"
}
```

### Error Responses

#### 400 Bad Request - Missing Parameters

```json
{
  "statusCode": 400,
  "message": "Region and city parameters are required",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Invalid Location

```json
{
  "statusCode": 400,
  "message": "Invalid region or city. Please check PSGC data.",
  "error": "Bad Request"
}
```

## Data Aggregation Rules

- Only includes prices from the last 30 days (configurable)
- Excludes outliers (prices more than 2 standard deviations from mean)
- Minimum sample size: At least 1 price input required to display average
- Verified prices are calculated separately from unverified prices
- Real-time updates when new price inputs are submitted

## Caching

- Cache duration: 5 minutes
- Cache invalidation: Updates immediately after new price submission
