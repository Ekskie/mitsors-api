# GET /api/users/submissions/:id

## Description

Get details of a specific price submission by ID. Only accessible by the user who created the submission.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`GET`

### Path

`/api/v1/users/submissions/:id`

### Path Parameters

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| `id`      | string | Yes      | MongoDB ObjectId of the price submission |

### Headers

```
Authorization: Bearer <session_token>
```

### Example Request

```bash
curl -X GET https://api.mitsors.com/api/users/submissions/65a1b2c3d4e5f6789022222 \
  -H "Authorization: Bearer <token>"
```

## Response

### Success Response (200 OK)

```json
{
  "id": "65a1b2c3d4e5f6789022222",
  "userId": "65a1b2c3d4e5f6789012346",
  "verificationStatus": "verified",
  "region": "Region III",
  "city": "Angeles City",
  "pricePerKg": 185.5,
  "livestockType": "fattener",
  "breed": "Large White",
  "notes": "Market price as of today. Prices are stable in this area.",
  "dateObserved": "2025-01-15T00:00:00Z",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

### Response Fields

- `id` (string): MongoDB ObjectId of the price input
- `userId` (string): MongoDB ObjectId of the user who submitted
- `verificationStatus` (string): User's verification status at time of submission ("verified" or "unverified")
- `region` (string): Region name
- `city` (string): City/municipality name
- `pricePerKg` (number): Price per kilogram in PHP
- `livestockType` (string | null): Livestock type if provided ("fattener", "piglet", or "both")
- `breed` (string | null): Breed if provided
- `notes` (string | null): Additional notes if provided
- `dateObserved` (string): ISO 8601 date when price was observed
- `createdAt` (string): ISO 8601 timestamp when submission was created
- `updatedAt` (string): ISO 8601 timestamp when submission was last updated

### Error Responses

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

#### 403 Forbidden - Access Denied

```json
{
  "statusCode": 403,
  "message": "You can only access your own submissions",
  "error": "Forbidden"
}
```

#### 404 Not Found - Submission Not Found

```json
{
  "statusCode": 404,
  "message": "Submission not found",
  "error": "Not Found"
}
```

#### 400 Bad Request - Invalid ID Format

```json
{
  "statusCode": 400,
  "message": "Invalid submission ID format",
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
3. Validates submission ID format (MongoDB ObjectId)
4. Fetches price submission from MongoDB `price_inputs` collection by ID
5. Verifies that the submission belongs to the authenticated user (security check)
6. Returns submission details

## Security

- Only the user who created the submission can access it
- Access control is enforced by comparing `userId` with the authenticated user's ID
- Invalid or non-existent IDs return 404 (not 403) to avoid information disclosure
- Users cannot access other users' submissions even if they know the ID

## Notes

- Returns complete submission details including all optional fields
- Verification status reflects the status at the time of submission (frozen value)
- Submission details cannot be edited after creation (immutable)
- This endpoint is useful for viewing full details of a specific submission from the submission history list
- Empty optional fields (livestockType, breed, notes) are returned as null
