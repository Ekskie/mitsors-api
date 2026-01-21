# POST /api/verification/submit

## Description

Submit verification documents (Valid ID and/or Business Permit) for admin review. SMS verification must be completed separately using the SMS endpoints before submitting documents.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`POST`

### Path

`/api/v1/verification/submit`

### Headers

```
Authorization: Bearer <session_token>
Content-Type: multipart/form-data
```

### Request Body (Form Data)

| Field            | Type   | Required | Description                                                                                                                      |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `validId`        | File   | Yes      | Image file of valid government-issued ID (JPG, PNG, max 5MB)                                                                     |
| `validIdType`    | string | Yes      | Type of ID being submitted. Valid values: "drivers_license", "national_id", "passport", "postal_id", "tin_id", "sss_id", "other" |
| `businessPermit` | File   | No       | Business permit document (JPG, PNG, PDF, max 10MB) - Optional but recommended                                                    |

### File Requirements

**Valid ID:**

- Format: JPG, PNG
- Max size: 5MB
- Must be clear and readable

**Business Permit:**

- Format: JPG, PNG, PDF
- Max size: 10MB
- Must be clear and readable

### Example Request

```bash
curl -X POST https://api.mitsors.com/api/verification/submit \
  -H "Authorization: Bearer <token>" \
  -F "validId=@/path/to/drivers_license.jpg" \
  -F "validIdType=drivers_license" \
  -F "businessPermit=@/path/to/business_permit.pdf"
```

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Verification documents submitted successfully. Pending admin review.",
  "verification": {
    "id": "65a1b2c3d4e5f6789077777",
    "userId": "65a1b2c3d4e5f6789012346",
    "status": "pending",
    "validIdUrl": "https://storage.mitsors.com/verification/valid-id/65a1b2c3d4e5f6789012346.jpg",
    "validIdType": "drivers_license",
    "businessPermitUrl": "https://storage.mitsors.com/verification/business-permit/65a1b2c3d4e5f6789012346.pdf",
    "submittedAt": "2025-01-15T10:30:00Z"
  }
}
```

### Response Fields

- `success` (boolean): Indicates successful submission
- `message` (string): Success message
- `verification` (object): Verification record details
  - `id` (string): MongoDB ObjectId of the verification record
  - `userId` (string): MongoDB ObjectId of the user
  - `status` (string): Current verification status ("pending")
  - `validIdUrl` (string): URL to stored valid ID document
  - `validIdType` (string): Type of ID submitted
  - `businessPermitUrl` (string | null): URL to stored business permit (if provided)
  - `submittedAt` (string): ISO 8601 timestamp of submission

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
      "field": "validId",
      "message": "Valid ID file is required"
    },
    {
      "field": "validId",
      "message": "File size exceeds 5MB limit"
    },
    {
      "field": "validId",
      "message": "Invalid file format. Only JPG and PNG are allowed"
    }
  ],
  "error": "Bad Request"
}
```

#### 400 Bad Request - Invalid ID Type

```json
{
  "statusCode": 400,
  "message": "Invalid validIdType. Allowed values: drivers_license, national_id, passport, postal_id, tin_id, sss_id, other",
  "error": "Bad Request"
}
```

#### 400 Bad Request - SMS Not Verified

```json
{
  "statusCode": 400,
  "message": "SMS verification must be completed before submitting documents",
  "error": "Bad Request"
}
```

#### 409 Conflict - Already Submitted

```json
{
  "statusCode": 409,
  "message": "Verification documents already submitted. Status: pending",
  "error": "Conflict"
}
```

#### 413 Payload Too Large

```json
{
  "statusCode": 413,
  "message": "File size exceeds maximum allowed size",
  "error": "Payload Too Large"
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

1. Validates that user has completed SMS verification (phone number must be verified)
2. Validates file formats and sizes
3. Uploads files to MongoDB GridFS or cloud storage (AWS S3, Cloudinary)
4. Creates or updates verification record in MongoDB `user_verifications` collection
5. Sets verification status to "pending"
6. Updates user's verification status in `users` collection to "pending"
7. Stores document URLs in verification record
8. Documents are queued for admin review

## Notes

- SMS verification must be completed first (use POST /api/verification/sms/verify)
- Business permit is optional but recommended
- If verification is already pending, user cannot resubmit until admin review is complete
- If verification was rejected, user can resubmit with new documents
- Documents are stored securely and only accessible by admins and the user who submitted them
- Admin review process is manual (separate admin dashboard)
- After submission, verification status changes to "pending" and user waits for admin approval/rejection
