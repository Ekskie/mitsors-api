# GET /api/users/profile

## Description

Get the authenticated user's profile information including firstName, lastName, displayName, region, city, userRoles, verification status, and OAuth provider information.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`GET`

### Path

`/api/v1/users/profile`

### Headers

```
Authorization: Bearer <session_token>
```

### Example Request

```bash
curl -X GET https://api.mitsors.com/api/users/profile \
  -H "Authorization: Bearer <token>"
```

## Response

### Success Response (200 OK)

```json
{
  "id": "65a1b2c3d4e5f6789012346",
  "email": "juan.delacruz@gmail.com",
  "name": "Juan Dela Cruz",
  "image": "https://lh3.googleusercontent.com/...",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "displayName": "Juan Dela Cruz",
  "region": "Region III",
  "city": "Angeles City",
  "userRoles": ["hog_raiser", "midman"],
  "verificationStatus": "verified",
  "emailVerified": true,
  "createdAt": "2025-01-10T08:00:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

### Response Fields

- `id` (string): MongoDB ObjectId of the user
- `email` (string | null): Email address from OAuth provider (may be null for some providers)
- `name` (string | null): Full name from OAuth provider
- `image` (string | null): Profile picture URL from OAuth provider
- `firstName` (string): User's first name
- `lastName` (string): User's last name
- `displayName` (string): Display name (can be edited by user, auto-generated from firstName and lastName if not set)
- `region` (string): Selected Philippine region
- `city` (string): Selected city/municipality
- `userRoles` (string[]): Array of user roles. Valid values: "hog_raiser", "public_market_seller", "midman"
- `verificationStatus` (string): Verification status - "unverified", "pending", "verified", or "rejected"
- `emailVerified` (boolean): Whether email is verified (from OAuth provider)
- `createdAt` (string): ISO 8601 timestamp of account creation
- `updatedAt` (string): ISO 8601 timestamp of last profile update

### Error Responses

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

#### 404 Not Found - User Not Found

```json
{
  "statusCode": 404,
  "message": "User profile not found",
  "error": "Not Found"
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
3. Fetches user profile from MongoDB `users` collection
4. Returns complete user profile information
5. Profile data includes both better-auth managed fields and custom fields (firstName, lastName, region, city, userRoles)

## Notes

- This endpoint returns the user's own profile only (determined by session token)
- Profile data is read from MongoDB (synced from AsyncStorage on signup for registered users)
- User roles is an array that can contain multiple roles
- Verification status reflects the current status of user's verification process
- Display name can be edited by user (see PATCH /api/users/profile)
- Profile picture comes from OAuth provider (Google/Facebook)
- Region and city are used for filtering price data in the dashboard
