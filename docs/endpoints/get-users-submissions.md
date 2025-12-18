# GET /api/users/submissions

## Description

Get the authenticated user's price submission history with pagination, sorting, and filtering options.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`GET`

### Path

`/api/v1/users/submissions`

### Query Parameters

| Parameter       | Type   | Required | Description                                                                       |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------- |
| `page`          | number | No       | Page number (default: 1)                                                          |
| `limit`         | number | No       | Items per page (default: 20, max: 100)                                            |
| `sort`          | string | No       | Sort field: `createdAt` (default), `pricePerKg`, `dateObserved`, `region`, `city` |
| `order`         | string | No       | Sort order: `desc` (default), `asc`                                               |
| `region`        | string | No       | Filter by region name                                                             |
| `city`          | string | No       | Filter by city/municipality name                                                  |
| `startDate`     | string | No       | Filter by start date (ISO 8601 format: YYYY-MM-DD)                                |
| `endDate`       | string | No       | Filter by end date (ISO 8601 format: YYYY-MM-DD)                                  |
| `livestockType` | string | No       | Filter by livestock type: `fattener`, `piglet`, `both`                            |

### Example Request

```bash
curl -X GET "https://api.mitsors.com/api/users/submissions?page=1&limit=20&sort=createdAt&order=desc" \
  -H "Authorization: Bearer <token>"
```

```bash
curl -X GET "https://api.mitsors.com/api/users/submissions?region=Region III&startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer <token>"
```

## Response

### Success Response (200 OK)

```json
{
  "submissions": [
    {
      "id": "65a1b2c3d4e5f6789022222",
      "userId": "65a1b2c3d4e5f6789012346",
      "verificationStatus": "verified",
      "region": "Region III",
      "city": "Angeles City",
      "pricePerKg": 185.5,
      "livestockType": "fattener",
      "breed": "Large White",
      "notes": "Market price as of today",
      "dateObserved": "2025-01-15T00:00:00Z",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "65a1b2c3d4e5f6789022221",
      "userId": "65a1b2c3d4e5f6789012346",
      "verificationStatus": "unverified",
      "region": "Region III",
      "city": "Angeles City",
      "pricePerKg": 182.3,
      "livestockType": "piglet",
      "breed": null,
      "notes": null,
      "dateObserved": "2025-01-14T00:00:00Z",
      "createdAt": "2025-01-14T09:15:00Z",
      "updatedAt": "2025-01-14T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Response Fields

- `submissions` (array): Array of price submission objects
  - `id` (string): MongoDB ObjectId of the price input
  - `userId` (string): MongoDB ObjectId of the user (always the authenticated user)
  - `verificationStatus` (string): User's verification status at time of submission ("verified" or "unverified")
  - `region` (string): Region name
  - `city` (string): City/municipality name
  - `pricePerKg` (number): Price per kilogram in PHP
  - `livestockType` (string | null): Livestock type if provided
  - `breed` (string | null): Breed if provided
  - `notes` (string | null): Notes if provided
  - `dateObserved` (string): ISO 8601 date when price was observed
  - `createdAt` (string): ISO 8601 timestamp when submission was created
  - `updatedAt` (string): ISO 8601 timestamp when submission was last updated
- `pagination` (object): Pagination information
  - `page` (number): Current page number
  - `limit` (number): Items per page
  - `total` (number): Total number of submissions
  - `totalPages` (number): Total number of pages
  - `hasNextPage` (boolean): Whether there is a next page
  - `hasPreviousPage` (boolean): Whether there is a previous page

### Empty Response (200 OK)

```json
{
  "submissions": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "message": "No submissions found"
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

#### 400 Bad Request - Invalid Sort Parameter

```json
{
  "statusCode": 400,
  "message": "Invalid sort parameter. Allowed values: createdAt, pricePerKg, dateObserved, region, city",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Invalid Date Format

```json
{
  "statusCode": 400,
  "message": "Invalid date format. Use ISO 8601 format (YYYY-MM-DD)",
  "error": "Bad Request"
}
```

#### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Business Logic

1. Validates authentication token
2. Retrieves user ID from session
3. Applies filters (region, city, date range, livestock type) if provided
4. Applies sorting (by field and order)
5. Applies pagination
6. Fetches price submissions from MongoDB `price_inputs` collection filtered by userId
7. Returns paginated results with metadata

## Filtering

- **Region**: Exact match filter
- **City**: Exact match filter (should be used together with region for accuracy)
- **Date Range**: Filters by `dateObserved` field (startDate to endDate, inclusive)
- **Livestock Type**: Exact match filter

## Sorting

Default sort: `createdAt` descending (most recent first)

Available sort fields:

- `createdAt`: Submission timestamp
- `pricePerKg`: Price value
- `dateObserved`: Date when price was observed
- `region`: Region name (alphabetical)
- `city`: City name (alphabetical)

## Notes

- Only returns submissions for the authenticated user (determined by session)
- Verification status reflects the status at the time of submission (does not change if user's status changes later)
- Default pagination: 20 items per page, maximum 100 items per page
- Empty submissions array with pagination info indicates no submissions match the filters
- Results are cached for 2 minutes (refreshes after new submission)
- Date filters use `dateObserved` field, not `createdAt`
