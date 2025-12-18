# POST /api/auth/signout

## Description

Sign out the current user by invalidating their authentication session.

## Authentication

**Required** - User must be authenticated (though endpoint may accept unauthenticated requests gracefully)

## Request

### Method

`POST`

### Path

`/api/v1/auth/signout`

### Headers

```
Authorization: Bearer <session_token>
```

or

```
Cookie: session=<session_cookie>
```

### Request Body

None required (empty body accepted)

### Example Request

```bash
curl -X POST https://api.mitsors.com/api/auth/signout \
  -H "Authorization: Bearer <token>"
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

### Response Fields

- `success` (boolean): Indicates successful sign out
- `message` (string): Success message

### Error Responses

#### 401 Unauthorized - No Active Session

```json
{
  "statusCode": 401,
  "message": "No active session to sign out",
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
2. Invalidates the session in the database
3. Clears session cookie if using cookie-based authentication
4. Returns success response

## Notes

- Session invalidation is handled by better-auth library
- After sign out, the user must authenticate again to access protected endpoints
- Session tokens become invalid immediately after sign out
- Client should clear any stored session tokens/cookies after successful sign out
- User data in MongoDB is not affected by sign out (only session is invalidated)
