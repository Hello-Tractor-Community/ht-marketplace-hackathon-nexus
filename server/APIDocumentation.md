# Educational Platform API Documentation

Base URL: `/api/v1`

## Authentication

### Register Institute Admin
```
POST /auth/register
```
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "institute_admin"
}
```
**Response:** (201)
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "institute_admin"
  }
}
```

### Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** (200)
```json
{
  "success": true,
  "token": "JWT_TOKEN"
}
```

## Institutes

### Create Institute
```
POST /institutes
```
**Auth:** Required (institute_admin)
**Request Body:**
```json
{
  "name": "string",
  "type": "TVET|College|University|Online Platform",
  "accreditation": "string",
  "description": "string",
  "location": {
    "address": "string",
    "city": "string"
  },
  "website": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "established": "date",
  "photo": "string (optional)"
}
```
**Response:** (201)
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    // ... all institute fields
  }
}
```

### Get All Institutes
```
GET /institutes
```
**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `type`: string (filter by institute type)
- `city`: string (filter by city)
- `q`: string (search query)

**Response:** (200)
```json
{
  "success": true,
  "data": [{
    "id": "string",
    "name": "string",
    // ... all institute fields
  }],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

### Get Institute by ID
```
GET /institutes/:id
```
**Response:** (200)
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "programs": [{
      "id": "string",
      "name": "string",
      // ... program fields
    }]
    // ... all institute fields
  }
}
```

### Update Institute
```
PUT /institutes/:id
```
**Auth:** Required (institute_admin)
**Request Body:** Same as Create Institute
**Response:** (200)
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    // ... updated institute fields
  }
}
```

### Delete Institute
```
DELETE /institutes/:id
```
**Auth:** Required (institute_admin)
**Response:** (200)
```json
{
  "success": true,
  "message": "Institute removed successfully"
}
```

## Programs

### Create Program
```
POST /institutes/:instituteId/programs
```
**Auth:** Required (institute_admin)
**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "duration": "string",
  "cost": "number",
  "schedule": "string",
  "requirements": ["string"],
  "outcomes": ["string"]
}
```
**Response:** (201)
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    // ... all program fields
  }
}
```

### Get Programs by Institute
```
GET /institutes/:instituteId/programs
```
**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `q`: string (search query)

**Response:** (200)
```json
{
  "success": true,
  "data": [{
    "id": "string",
    "name": "string",
    // ... all program fields
  }],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

## Search and Filters

### Search Institutes and Programs
```
GET /search
```
**Query Parameters:**
- `q`: string (search query)
- `type`: string (institute type)
- `city`: string
- `duration`: string
- `costRange`: string (e.g., "0-5000")
- `page`: number
- `limit`: number

**Response:** (200)
```json
{
  "success": true,
  "data": {
    "institutes": [{
      "id": "string",
      "name": "string",
      "matchingPrograms": [{
        "id": "string",
        "name": "string"
      }]
    }],
    "total": number,
    "page": number,
    "pages": number
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Error message describing the validation failure"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```