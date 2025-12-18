# GET /api/auth/session

## Description

Get the current user's authentication session information. Returns session details and user information if authenticated, or null if no active session exists.

## Authentication

Not required (returns null if not authenticated)

## Request

### Method

`GET`

### Path

`/api/v1/auth/session`

### Headers

```
Authorization: Bearer <session_token>
```

or

```
Cookie: session=<session_cookie>
```

### Example Request

```bash
curl -X GET https://api.mitsors.com/api/auth/session \
  -H "Authorization: Bearer <token>"
```

## Response

### Success Response - Authenticated (200 OK)

```json
{
  "authenticated": true,
  "session": {
    "id": "session_id_here",
    "userId": "65a1b2c3d4e5f6789012346",
    "expiresAt": "2025-02-15T10:30:00Z",
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "user": {
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
    "createdAt": "2025-01-10T08:00:00Z"
  }
}
```

### Success Response - Not Authenticated (200 OK)

```json
{
  "authenticated": false,
  "session": null,
  "user": null
}
```

### Response Fields (Authenticated)

- `authenticated` (boolean): Whether user is authenticated
- `session` (object | null): Session information
  - `id` (string): Session identifier
  - `userId` (string): MongoDB ObjectId of the user
  - `expiresAt` (string): ISO 8601 timestamp when session expires
  - `createdAt` (string): ISO 8601 timestamp when session was created
- `user` (object | null): User profile data
  - `id` (string): MongoDB ObjectId of the user
  - `email` (string): Email address
  - `name` (string): Full name from OAuth provider
  - `image` (string): Profile picture URL
  - `firstName` (string): First name
  - `lastName` (string): Last name
  - `displayName` (string): Display name
  - `region` (string): Selected region
  - `city` (string): Selected city
  - `userRoles` (string[]): Array of user roles
  - `verificationStatus` (string): Verification status ("unverified", "pending", "verified", "rejected")
  - `createdAt` (string): ISO 8601 timestamp of account creation

### Error Responses

#### 401 Unauthorized - Invalid Session Token

```json
{
  "statusCode": 401,
  "message": "Invalid or expired session token",
  "error": "Unauthorized"
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

1. Validates session token/cookie using better-auth
2. If valid session exists:
   - Retrieves session information
   - Fetches user profile from MongoDB
   - Returns session and user data
3. If no valid session:
   - Returns authenticated: false with null session and user
4. Session expiration is checked automatically by better-auth

## Notes

- Session management is handled by better-auth library
- Session tokens can be provided via Authorization header or cookies
- Returns 200 OK even when not authenticated (check `authenticated` field)
- User data is fetched fresh from MongoDB on each request (not cached)
- This endpoint can be used to check authentication status before making protected API calls
