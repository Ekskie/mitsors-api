# PATCH /api/users/profile

## Description

Update the authenticated user's profile information. Can update firstName, lastName, displayName, region, city, and userRoles. Updates are synced to both MongoDB and should also be updated in AsyncStorage on the client side.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`PATCH`

### Path

`/api/v1/users/profile`

### Headers

```
Authorization: Bearer <session_token>
Content-Type: application/json
```

### Request Body

All fields are optional - only include fields you want to update:

```json
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "displayName": "Juan D.",
  "region": "Region III",
  "city": "Angeles City",
  "userRoles": ["hog_raiser", "public_market_seller", "midman"]
}
```

### Request Body Fields

| Field         | Type     | Required | Description                         | Validation                                                                               |
| ------------- | -------- | -------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `firstName`   | string   | No       | User's first name                   | 2-50 characters                                                                          |
| `lastName`    | string   | No       | User's last name                    | 2-50 characters                                                                          |
| `displayName` | string   | No       | Display name (what other users see) | 2-100 characters                                                                         |
| `region`      | string   | No       | Philippine region name              | Must match PSGC region names                                                             |
| `city`        | string   | No       | City or municipality name           | Must be within the specified region                                                      |
| `userRoles`   | string[] | No       | Array of user roles                 | Must be array containing at least one of: "hog_raiser", "public_market_seller", "midman" |

### Example Request

```bash
curl -X PATCH https://api.mitsors.com/api/users/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "displayName": "Juan D.",
    "region": "NCR",
    "city": "Manila",
    "userRoles": ["hog_raiser", "midman"]
  }'
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "65a1b2c3d4e5f6789012346",
    "email": "juan.delacruz@gmail.com",
    "name": "Juan Dela Cruz",
    "image": "https://lh3.googleusercontent.com/...",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "displayName": "Juan D.",
    "region": "NCR",
    "city": "Manila",
    "userRoles": ["hog_raiser", "midman"],
    "verificationStatus": "verified",
    "emailVerified": true,
    "createdAt": "2025-01-10T08:00:00Z",
    "updatedAt": "2025-01-15T11:00:00Z"
  }
}
```

### Response Fields

- `success` (boolean): Indicates successful update
- `message` (string): Success message
- `user` (object): Updated user profile (same structure as GET /api/users/profile)

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
      "field": "firstName",
      "message": "First name must be between 2 and 50 characters"
    },
    {
      "field": "userRoles",
      "message": "User roles must be an array with at least one valid role"
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

#### 400 Bad Request - Invalid User Roles

```json
{
  "statusCode": 400,
  "message": "Invalid user roles. Allowed values: hog_raiser, public_market_seller, midman",
  "error": "Bad Request"
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
3. Validates request body fields (if provided)
4. Validates location data against PSGC database (if region/city updated)
5. Updates user profile in MongoDB `users` collection
6. Updates `updatedAt` timestamp
7. Returns updated user profile
8. Client should sync updates to AsyncStorage after successful update

## Validation Rules

- `firstName`: Minimum 2 characters, maximum 50 characters
- `lastName`: Minimum 2 characters, maximum 50 characters
- `displayName`: Minimum 2 characters, maximum 100 characters
- `region`: Must be a valid Philippine region (validated against PSGC)
- `city`: Must be a valid city/municipality within the specified region (validated against PSGC)
- `userRoles`: Must be an array containing at least one valid role. Valid values: "hog_raiser", "public_market_seller", "midman"

## Notes

- Only provided fields are updated (partial updates supported)
- All updates are stored in MongoDB
- Client should update AsyncStorage with the same values after successful API response
- Region and city updates affect price data filtering in the dashboard
- User roles can be updated to add or remove roles (must include at least one role)
- Display name can be customized or auto-generated from firstName and lastName
- Email, name, and image from OAuth provider cannot be updated via this endpoint
- Profile updates do not affect verification status
