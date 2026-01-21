# POST /api/auth/signin/google

## Description

Authenticate user via Google OAuth login. On successful authentication, creates a user session and user profile in MongoDB. Includes firstName, lastName, region, city, and userRoles from AsyncStorage in the signup request.

## Authentication

Not required (this endpoint performs authentication)

## Request

### Method

`POST`

### Path

`/api/v1/auth/signin/google`

### Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "googleToken": "google_oauth_token_here",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "region": "Region III",
  "city": "Angeles City",
  "userRoles": ["hog_raiser", "midman"]
}
```

### Request Body Fields

| Field         | Type     | Required | Description                                                                                           |
| ------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `googleToken` | string   | Yes      | Google OAuth access token or ID token                                                                 |
| `firstName`   | string   | Yes      | User's first name (from AsyncStorage)                                                                 |
| `lastName`    | string   | Yes      | User's last name (from AsyncStorage)                                                                  |
| `region`      | string   | Yes      | Selected Philippine region (from AsyncStorage)                                                        |
| `city`        | string   | Yes      | Selected city/municipality (from AsyncStorage)                                                        |
| `userRoles`   | string[] | Yes      | Array of user roles (from AsyncStorage). Valid values: "hog_raiser", "public_market_seller", "midman" |

### Example Request

```bash
curl -X POST https://api.mitsors.com/api/auth/signin/google \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "ya29.a0AfH6SMB...",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "region": "Region III",
    "city": "Angeles City",
    "userRoles": ["hog_raiser", "midman"]
  }'
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Authentication successful",
  "session": {
    "id": "session_id_here",
    "userId": "65a1b2c3d4e5f6789012346",
    "expiresAt": "2025-02-15T10:30:00Z"
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
    "verificationStatus": "unverified",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Response Fields

- `success` (boolean): Indicates successful authentication
- `message` (string): Success message
- `session` (object): Session information
  - `id` (string): Session identifier
  - `userId` (string): MongoDB ObjectId of the user
  - `expiresAt` (string): ISO 8601 timestamp when session expires
- `user` (object): User profile data
  - `id` (string): MongoDB ObjectId of the user
  - `email` (string): Email address from Google account
  - `name` (string): Full name from Google account
  - `image` (string): Profile picture URL from Google
  - `firstName` (string): First name (from signup request)
  - `lastName` (string): Last name (from signup request)
  - `displayName` (string): Display name (auto-generated from firstName and lastName)
  - `region` (string): Selected region (from signup request)
  - `city` (string): Selected city (from signup request)
  - `userRoles` (string[]): Array of user roles (from signup request)
  - `verificationStatus` (string): Initial verification status ("unverified")
  - `createdAt` (string): ISO 8601 timestamp of account creation

### Error Responses

#### 400 Bad Request - Invalid Token

```json
{
  "statusCode": 400,
  "message": "Invalid Google OAuth token",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Missing Required Fields

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "firstName",
      "message": "First name is required"
    },
    {
      "field": "region",
      "message": "Region is required"
    }
  ],
  "error": "Bad Request"
}
```

#### 400 Bad Request - Invalid User Roles

```json
{
  "statusCode": 400,
  "message": "Invalid user roles. Allowed values: hog_raiser, public_market_seller, midman",
  "error": "Bad Request"
}
```

#### 401 Unauthorized - Google Authentication Failed

```json
{
  "statusCode": 401,
  "message": "Google authentication failed",
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

1. Validates Google OAuth token with Google's API
2. Retrieves user information from Google (email, name, profile picture)
3. Creates or updates user record in MongoDB with:
   - OAuth provider data (email, name, image)
   - firstName and lastName from request body (from AsyncStorage)
   - region and city from request body (from AsyncStorage)
   - userRoles array from request body (from AsyncStorage)
   - verificationStatus set to "unverified"
4. Creates session using better-auth
5. Returns session information and user profile

## Notes

- If user already exists (matched by email), profile is updated with new firstName, lastName, region, city, and userRoles
- All fields from AsyncStorage (firstName, lastName, region, city, userRoles) are required in the request body
- User roles must be an array containing at least one valid role
- Session is managed by better-auth library (cookies/tokens)
- After successful signup, name, location, and roles are stored in MongoDB and accessible across devices
