# POST /api/verification/sms/verify

## Description

Verify the OTP code sent via SMS to complete phone number verification. This must be done before submitting verification documents.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`POST`

### Path

`/api/v1/verification/sms/verify`

### Headers

```
Authorization: Bearer <session_token>
Content-Type: application/json
```

### Request Body

```json
{
  "phoneNumber": "+639171234567",
  "otp": "123456"
}
```

### Request Body Fields

| Field         | Type   | Required | Description                                                                                |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------ |
| `phoneNumber` | string | Yes      | Phone number in Philippine format (+63XXXXXXXXXX) - must match the number used in SMS send |
| `otp`         | string | Yes      | 6-digit OTP code received via SMS                                                          |

### Example Request

```bash
curl -X POST https://api.mitsors.com/api/verification/sms/verify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+639171234567",
    "otp": "123456"
  }'
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "phoneNumber": {
    "number": "+639171234567",
    "verified": true,
    "verifiedAt": "2025-01-15T10:35:00Z"
  }
}
```

### Response Fields

- `success` (boolean): Indicates successful verification
- `message` (string): Success message
- `phoneNumber` (object): Phone verification details
  - `number` (string): Verified phone number
  - `verified` (boolean): Verification status (always true on success)
  - `verifiedAt` (string): ISO 8601 timestamp when verification was completed

### Error Responses

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

#### 400 Bad Request - Invalid OTP

```json
{
  "statusCode": 400,
  "message": "Invalid or expired OTP code",
  "error": "Bad Request"
}
```

#### 400 Bad Request - OTP Expired

```json
{
  "statusCode": 400,
  "message": "OTP code has expired. Please request a new one.",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Phone Number Mismatch

```json
{
  "statusCode": 400,
  "message": "Phone number does not match the number used to send OTP",
  "error": "Bad Request"
}
```

#### 400 Bad Request - No OTP Request Found

```json
{
  "statusCode": 400,
  "message": "No OTP request found for this phone number. Please request OTP first.",
  "error": "Bad Request"
}
```

#### 429 Too Many Requests - Too Many Verification Attempts

```json
{
  "statusCode": 429,
  "message": "Too many verification attempts. Please request a new OTP.",
  "error": "Too Many Requests",
  "retryAfter": 60
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

1. Validates phone number format
2. Checks if OTP request exists for the provided phone number
3. Validates OTP code (checks hash against stored hash)
4. Checks if OTP has expired (5 minutes from send time)
5. Verifies OTP matches the one sent to the phone number
6. Marks phone number as verified in user's verification record
7. Stores verified phone number with timestamp in MongoDB
8. Invalidates/consumes the OTP (cannot be used again)
9. Returns success response with verification details

## OTP Validation Rules

- OTP must match the code sent to the phone number
- OTP must not be expired (valid for 5 minutes)
- OTP can only be used once
- Maximum 5 verification attempts per OTP before requiring new OTP
- Phone number in request must match the phone number used to send OTP

## Notes

- OTP expires after 5 minutes
- After successful verification, user can proceed with document submission
- Phone number is stored in user's verification record in MongoDB
- Once verified, phone number cannot be changed without admin intervention
- If verification fails multiple times, user should request a new OTP
- Phone verification is a required step before submitting ID and business permit documents
- After phone verification, user's verification record is created/updated with phoneVerified: true
