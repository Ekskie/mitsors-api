# GET /api/verification/documents/:type

## Description

Get a verification document (Valid ID or Business Permit) that was previously uploaded by the authenticated user. Returns the document file for viewing/downloading.

## Authentication

**Required** - User must be authenticated and can only access their own documents

## Request

### Method

`GET`

### Path

`/api/v1/verification/documents/:type`

### Path Parameters

| Parameter | Type   | Required | Description                                                                 |
| --------- | ------ | -------- | --------------------------------------------------------------------------- |
| `type`    | string | Yes      | Type of document to retrieve. Valid values: "valid-id" or "business-permit" |

### Headers

```
Authorization: Bearer <session_token>
```

### Example Request

```bash
curl -X GET https://api.mitsors.com/api/verification/documents/valid-id \
  -H "Authorization: Bearer <token>" \
  --output id_document.jpg
```

## Response

### Success Response (200 OK)

Returns the document file with appropriate Content-Type header:

**For Valid ID (image):**

```
Content-Type: image/jpeg
Content-Disposition: inline; filename="valid-id.jpg"

[binary image data]
```

**For Business Permit (PDF):**

```
Content-Type: application/pdf
Content-Disposition: inline; filename="business-permit.pdf"

[binary PDF data]
```

### Response Headers

- `Content-Type`: MIME type of the document (image/jpeg, image/png, or application/pdf)
- `Content-Disposition`: Suggested filename for download
- `Content-Length`: Size of the file in bytes

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
  "message": "You can only access your own verification documents",
  "error": "Forbidden"
}
```

#### 400 Bad Request - Invalid Document Type

```json
{
  "statusCode": 400,
  "message": "Invalid document type. Allowed values: valid-id, business-permit",
  "error": "Bad Request"
}
```

#### 404 Not Found - Document Not Found

```json
{
  "statusCode": 404,
  "message": "Document not found. You may not have uploaded this document yet.",
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
2. Validates document type parameter (must be "valid-id" or "business-permit")
3. Retrieves user's verification record from MongoDB
4. Checks if the requested document exists for this user
5. Verifies that the requesting user is the owner of the document (security check)
6. Retrieves document from MongoDB GridFS or cloud storage (AWS S3, Cloudinary)
7. Returns document file with appropriate headers

## Security

- Only the document owner (authenticated user) can access their own documents
- Documents are not accessible by other users or admins via this endpoint
- Admin review of documents is handled through a separate admin dashboard/system
- Document URLs are not publicly accessible - authentication is required
- Documents are stored securely in MongoDB GridFS or encrypted cloud storage

## Notes

- Documents can only be retrieved by the user who uploaded them
- Valid ID documents are typically JPG or PNG images
- Business permit documents can be JPG, PNG, or PDF
- Documents are served directly as binary data (not JSON)
- Client should handle binary file download/viewing appropriately
- Documents remain accessible even after verification is completed or rejected
- Document access is logged for security/audit purposes
