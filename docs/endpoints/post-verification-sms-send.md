# POST /api/verification/sms/send

## Description

Send an OTP (One-Time Password) via SMS to the provided phone number for verification. This is the first step in the verification process.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`POST`

### Path

`/api/v1/verification/sms/send`

### Headers

```
Authorization: Bearer <session_token>
Content-Type: application/json
```

### Request Body

```json
{
  "phoneNumber": "+639171234567"
}
```

### Request Body Fields

| Field         | Type   | Required | Description                                       |
| ------------- | ------ | -------- | ------------------------------------------------- |
| `phoneNumber` | string | Yes      | Phone number in Philippine format (+63XXXXXXXXXX) |

### Phone Number Format

- Must start with +63 (Philippines country code)
- Followed by 10 digits (mobile number without leading 0)
- Example: +639171234567

### Example Request

```bash
curl -X POST https://api.mitsors.com/api/verification/sms/send \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+639171234567"
  }'
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "OTP sent successfully to +639171234567",
  "expiresIn": 300
}
```

### Response Fields

- `success` (boolean): Indicates successful OTP sending
- `message` (string): Success message (phone number is partially masked for privacy)
- `expiresIn` (number): OTP expiration time in seconds (typically 5 minutes / 300 seconds)

### Error Responses

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

#### 400 Bad Request - Invalid Phone Number Format

```json
{
  "statusCode": 400,
  "message": "Invalid phone number format. Must be in format +63XXXXXXXXXX",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Phone Number Already Verified

```json
{
  "statusCode": 400,
  "message": "This phone number is already verified",
  "error": "Bad Request"
}
```

#### 429 Too Many Requests - Rate Limit Exceeded

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Maximum 3 OTP requests per day per phone number.",
  "error": "Too Many Requests",
  "retryAfter": 86400
}
```

#### 500 Internal Server Error - SMS Service Error

```json
{
  "statusCode": 500,
  "message": "Failed to send SMS. Please try again later.",
  "error": "Internal Server Error"
}
```

## Business Logic

1. Validates phone number format (must be Philippine format: +63XXXXXXXXXX)
2. Checks if phone number is already verified for this user
3. Applies rate limiting (max 3 OTP requests per day per phone number)
4. Generates a 6-digit OTP code
5. Sends OTP via SMS using third-party SMS service (Twilio, Vonage, or local Philippine SMS provider)
6. Stores OTP hash in database with expiration time (5 minutes)
7. Associates OTP with user ID and phone number
8. Returns success response

## Rate Limiting

- Maximum 3 OTP requests per day per phone number
- Rate limit is applied per phone number (not per user)
- Exceeding the limit returns 429 Too Many Requests
- Reset period: 24 hours from first request

## SMS Provider

- Uses third-party SMS service integrated with NestJS backend
- Providers: Twilio, Vonage, or local Philippine SMS provider
- OTP message format: "Your MITSORS verification code is: 123456. Valid for 5 minutes."

## Notes

- OTP expires after 5 minutes
- OTP is hashed in the database (not stored in plain text)
- User must verify the OTP using POST /api/verification/sms/verify before proceeding with document submission
- If phone number is already verified, user cannot request new OTP for that number
- SMS delivery is not guaranteed (network issues, invalid number, etc.) - user should contact support if OTP not received
- After successful OTP verification, phone number is marked as verified in user's verification record
