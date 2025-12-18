# GET /api/verification/status

## Description

Get the current user's verification status and details. For verified users, includes URLs to verification documents (ID, business permit) and phone number information.

## Authentication

**Required** - User must be authenticated

## Request

### Method

`GET`

### Path

`/api/v1/verification/status`

### Headers

```
Authorization: Bearer <session_token>
```

### Example Request

```bash
curl -X GET https://api.mitsors.com/api/verification/status \
  -H "Authorization: Bearer <token>"
```

## Response

### Success Response - Verified User (200 OK)

```json
{
  "status": "verified",
  "phoneNumber": {
    "number": "+63********1234",
    "masked": true,
    "verified": true,
    "verifiedAt": "2025-01-10T08:00:00Z"
  },
  "validId": {
    "url": "https://storage.mitsors.com/verification/valid-id/65a1b2c3d4e5f6789012346.jpg",
    "type": "Philippine Driver's License",
    "verified": true,
    "verifiedAt": "2025-01-10T09:00:00Z"
  },
  "businessPermit": {
    "url": "https://storage.mitsors.com/verification/business-permit/65a1b2c3d4e5f6789012346.pdf",
    "verified": true,
    "verifiedAt": "2025-01-10T10:00:00Z"
  },
  "reviewedBy": "65a1b2c3d4e5f6789019999",
  "reviewedAt": "2025-01-10T10:30:00Z",
  "verifiedAt": "2025-01-10T10:30:00Z"
}
```

### Success Response - Pending Verification (200 OK)

```json
{
  "status": "pending",
  "phoneNumber": {
    "number": "+639171234567",
    "masked": false,
    "verified": true,
    "verifiedAt": "2025-01-15T08:00:00Z"
  },
  "validId": {
    "url": "https://storage.mitsors.com/verification/valid-id/65a1b2c3d4e5f6789012346.jpg",
    "type": "National ID (PhilSys)",
    "verified": false,
    "uploadedAt": "2025-01-15T09:00:00Z"
  },
  "businessPermit": null,
  "reviewedBy": null,
  "reviewedAt": null,
  "verifiedAt": null
}
```

### Success Response - Unverified User (200 OK)

```json
{
  "status": "unverified",
  "phoneNumber": null,
  "validId": null,
  "businessPermit": null,
  "reviewedBy": null,
  "reviewedAt": null,
  "verifiedAt": null
}
```

### Success Response - Rejected Verification (200 OK)

```json
{
  "status": "rejected",
  "phoneNumber": {
    "number": "+639171234567",
    "masked": false,
    "verified": true,
    "verifiedAt": "2025-01-15T08:00:00Z"
  },
  "validId": {
    "url": "https://storage.mitsors.com/verification/valid-id/65a1b2c3d4e5f6789012346.jpg",
    "type": "Philippine Driver's License",
    "verified": false,
    "uploadedAt": "2025-01-15T09:00:00Z"
  },
  "businessPermit": null,
  "rejectionReason": "ID image is unclear or unreadable",
  "reviewedBy": "65a1b2c3d4e5f6789019999",
  "reviewedAt": "2025-01-15T11:00:00Z",
  "verifiedAt": null
}
```

### Response Fields

- `status` (string): Verification status - "unverified", "pending", "verified", or "rejected"
- `phoneNumber` (object | null): Phone verification information
  - `number` (string): Phone number (masked if verified, full number if pending/unverified for the user's own viewing)
  - `masked` (boolean): Whether the number is masked in the response
  - `verified` (boolean): Whether phone number is verified
  - `verifiedAt` (string | null): ISO 8601 timestamp when phone was verified
- `validId` (object | null): Valid ID document information
  - `url` (string): URL to access the ID document (requires authentication)
  - `type` (string): Type of ID (e.g., "Philippine Driver's License", "National ID (PhilSys)")
  - `verified` (boolean): Whether ID has been verified by admin
  - `verifiedAt` (string | null): ISO 8601 timestamp when ID was verified
  - `uploadedAt` (string | null): ISO 8601 timestamp when ID was uploaded (if not yet verified)
- `businessPermit` (object | null): Business permit document information (same structure as validId)
- `rejectionReason` (string | null): Reason for rejection (only present if status is "rejected")
- `reviewedBy` (string | null): MongoDB ObjectId of admin who reviewed (if reviewed)
- `reviewedAt` (string | null): ISO 8601 timestamp when review was completed
- `verifiedAt` (string | null): ISO 8601 timestamp when verification was completed

### Error Responses

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "error": "Unauthorized"
}
```

#### 404 Not Found - No Verification Record

```json
{
  "statusCode": 404,
  "message": "Verification record not found",
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

1. Retrieves user's verification status from MongoDB `user_verifications` collection
2. For verified users, includes document URLs that require authentication to access
3. Phone numbers are masked for verified users in the response (showing only last 4 digits)
4. Document URLs point to MongoDB GridFS or cloud storage (AWS S3, Cloudinary)
5. Only the user can access their own verification documents via the provided URLs

## Notes

- Document URLs require authentication token to access (use GET /api/verification/documents/:type)
- Phone numbers are masked for privacy when verification is complete
- Users can view their own verification documents but cannot view other users' documents
- Verification status flows: unverified → pending → verified/rejected
- Business permit is optional but recommended for verification
- All document URLs are temporary or require authentication to prevent unauthorized access
