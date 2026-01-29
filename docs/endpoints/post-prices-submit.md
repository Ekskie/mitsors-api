# POST /api/prices/submit

## Description
Submit a new liveweight price input for hogs. This endpoint is only accessible to registered and authenticated users.

## Authentication
**Required** - User must be registered and logged in.

## Request

### Method
`POST`

### Path
`/api/prices/submit`

### Headers
```
Authorization: Bearer <session_token>
Content-Type: application/json
```

### Request Body

```json
{
  "region": "Region III",
  "city": "Angeles City",
  "pricePerKg": 185.50,
  "livestockType": "fattener",
  "breed": "Large White",
  "notes": "Market price as of today",
  "dateObserved": "2025-01-15"
}
```

### Request Body Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `region` | string | Yes | Philippine region name | Must match PSGC region names |
| `city` | string | Yes | City or municipality name | Must be within the specified region |
| `pricePerKg` | number | Yes | Price per kilogram in PHP | Minimum: 50.00, Maximum: 500.00, 2 decimal places |
| `livestockType` | string | No | Type of livestock | Enum: "fattener", "piglet", "both" |
| `breed` | string | No | Livestock breed | Max 100 characters |
| `notes` | string | No | Additional context or notes | Max 500 characters |
| `dateObserved` | string | No | Date when price was observed | ISO 8601 date format (YYYY-MM-DD), defaults to today |

### Example Request

```bash
curl -X POST https://api.mitsors.com/api/prices/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "Region III",
    "city": "Angeles City",
    "pricePerKg": 185.50,
    "livestockType": "fattener",
    "dateObserved": "2025-01-15"
  }'
```

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Price submitted successfully!",
  "data": {
    "id": "65a1b2c3d4e5f6789012345",
    "userId": "65a1b2c3d4e5f6789012346",
    "verificationStatus": "verified",
    "region": "Region III",
    "city": "Angeles City",
    "pricePerKg": 185.50,
    "livestockType": "fattener",
    "breed": "Large White",
    "notes": "Market price as of today",
    "dateObserved": "2025-01-15T00:00:00Z",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Response Fields
- `success` (boolean): Indicates successful submission
- `message` (string): Success message
- `data` (object): The created price input record
  - `id` (string): MongoDB ObjectId of the price input
  - `userId` (string): MongoDB ObjectId of the submitting user
  - `verificationStatus` (string): User's verification status at time of submission ("verified" or "unverified")
  - `region` (string): Region name
  - `city` (string): City/municipality name
  - `pricePerKg` (number): Price per kilogram
  - `livestockType` (string | null): Livestock type if provided
  - `breed` (string | null): Breed if provided
  - `notes` (string | null): Notes if provided
  - `dateObserved` (string): ISO 8601 date of observation
  - `createdAt` (string): ISO 8601 timestamp of submission

### Error Responses

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

#### 400 Bad Request - Validation Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "pricePerKg",
      "message": "Price must be between 50.00 and 500.00 PHP per kilogram"
    }
  ],
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

#### 429 Too Many Requests - Rate Limit Exceeded
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Maximum 10 submissions per hour per user.",
  "error": "Too Many Requests",
  "retryAfter": 3600
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

## Rate Limiting

- Maximum 10 submissions per hour per user
- Rate limit is applied per authenticated user ID
- Exceeding the limit returns 429 Too Many Requests

## Business Logic

1. User's verification status is fetched from their profile and included in the price input record
2. Price input is stored in MongoDB `price_inputs` collection
3. Price aggregations are updated in real-time
4. Dashboard data cache is invalidated to reflect new submission
5. Success response includes the complete price input record

## Notes

- Location (region/city) is pre-filled from user profile but can be overridden if submitting for a different area
- `dateObserved` defaults to current date if not provided
- Verification status is captured at submission time and does not change if user's status changes later
- Optional fields can be omitted or set to null

