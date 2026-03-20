# API Endpoints Reference

Quick reference guide for all API endpoints in the StudentsHerald Admin Portal backend.

---

## Base URL
```
http://localhost:3001/api
```

---

## Authentication Endpoints

### 1. Login
**POST** `/auth/login`

**Description:** Authenticate user and get JWT token

**Request:**
```json
{
  "email": "superadmin@studentsherald.com",
  "password": "SuperAdmin@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": 98,
      "email": "superadmin@studentsherald.com",
      "type": "admin",
      "roles": [...],
      "permissions": [...]
    }
  }
}
```

**PowerShell Test:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"superadmin@studentsherald.com","password":"SuperAdmin@123"}'
```

---

### 2. Register
**POST** `/auth/register`

**Description:** Create new user with role

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "role_type_id": 4,
  "two_factor_required": false
}
```

---

### 3. Get Profile
**GET** `/auth/profile`

**Description:** Get current user profile

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 98,
    "email": "superadmin@studentsherald.com",
    "roles": [...],
    "permissions": [...],
    "lastLogin": "2026-02-14T01:14:38.000Z"
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Description:** Logout user (client-side token removal)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 5. Get All Roles
**GET** `/auth/roles`

**Description:** Get all available roles (admin only)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "code": "ADMIN",
      "default_permission": "ALL,ACCESS_ADMIN_PORTAL,...",
      "is_enable": true
    }
  ]
}
```

---

### 6. Get All Users
**GET** `/auth/users`

**Description:** Get all users with pagination (admin only)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `size` (number) - Items per page (default: 10)
- `search` (string) - Search by name or email
- `role_type_id` (number) - Filter by role
- `type` (string) - Filter by user type (admin/operator)

**Example:**
```
GET /auth/users?page=1&size=10&search=admin&type=admin
```

---

## Configuration Endpoints (Dynamic System)

### 1. Get All Option Types
**GET** `/config/option-types`

**Description:** Get all configuration option types

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Article Status",
      "code": "ARTICLE_STATUS",
      "description": "Status options for articles"
    }
  ]
}
```

---

### 2. Get Options by Type
**GET** `/config/options/:typeCode`

**Description:** Get all options for a specific type

**Example:**
```
GET /config/options/ARTICLE_STATUS
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "label": "Draft",
      "value": "draft",
      "color": "#6B7280",
      "icon": "edit",
      "order_index": 1,
      "is_active": true
    }
  ]
}
```

---

### 3. Create Option
**POST** `/config/options`

**Description:** Create new configuration option (admin only)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "type_code": "ARTICLE_STATUS",
  "label": "Published",
  "value": "published",
  "color": "#10B981",
  "icon": "check",
  "order_index": 3,
  "is_active": true
}
```

---

### 4. Update Option
**PUT** `/config/options/:id`

**Description:** Update configuration option (admin only)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 5. Delete Option
**DELETE** `/config/options/:id`

**Description:** Delete configuration option (admin only)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 6. Get Navigation Menu
**GET** `/config/navigation`

**Description:** Get navigation menu items

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "label": "Dashboard",
      "path": "/dashboard",
      "icon": "dashboard",
      "order_index": 1,
      "is_active": true,
      "parent_id": null
    }
  ]
}
```

---

## Article Endpoints

### 1. Get All Articles
**GET** `/articles`

**Query Parameters:**
- `page` (number) - Page number
- `size` (number) - Items per page
- `status` (string) - Filter by status
- `category` (string) - Filter by category
- `search` (string) - Search by title

---

### 2. Get Article by ID
**GET** `/articles/:id`

---

### 3. Create Article
**POST** `/articles`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "title": "Article Title",
  "content": "Article content...",
  "status": "draft",
  "category_id": 1,
  "tags": ["tag1", "tag2"]
}
```

---

### 4. Update Article
**PUT** `/articles/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 5. Delete Article
**DELETE** `/articles/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Category Endpoints

### 1. Get All Categories
**GET** `/categories`

---

### 2. Create Category
**POST** `/categories`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 3. Update Category
**PUT** `/categories/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 4. Delete Category
**DELETE** `/categories/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Course Endpoints

### 1. Get All Courses
**GET** `/courses`

---

### 2. Create Course
**POST** `/courses`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 3. Update Course
**PUT** `/courses/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 4. Delete Course
**DELETE** `/courses/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Contact Endpoints

### 1. Get All Contacts
**GET** `/contacts`

**Query Parameters:**
- `page` (number) - Page number
- `size` (number) - Items per page
- `status` (string) - Filter by status

---

### 2. Update Contact Status
**PUT** `/contacts/:id/status`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Carousel Endpoints

### 1. Get All Carousels
**GET** `/carousels`

---

### 2. Create Carousel
**POST** `/carousels`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 3. Update Carousel
**PUT** `/carousels/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 4. Delete Carousel
**DELETE** `/carousels/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## University Endpoints

### 1. Get All Universities
**GET** `/universities`

---

### 2. Create University
**POST** `/universities`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 3. Update University
**PUT** `/universities/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 4. Delete University
**DELETE** `/universities/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Document Endpoints

### 1. Get All Documents
**GET** `/documents`

---

### 2. Upload Document
**POST** `/documents/upload`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

---

### 3. Delete Document
**DELETE** `/documents/:id`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Analytics Endpoints

### 1. Get Dashboard Stats
**GET** `/analytics/dashboard`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 2. Get Article Analytics
**GET** `/analytics/articles`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Testing with PowerShell

### Save Token for Multiple Requests
```powershell
# Login and save token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"superadmin@studentsherald.com","password":"SuperAdmin@123"}'

$token = $loginResponse.token

# Use token for authenticated requests
$headers = @{ Authorization = "Bearer $token" }

# Get profile
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/profile" `
  -Method GET `
  -Headers $headers

# Get articles
Invoke-RestMethod -Uri "http://localhost:3001/api/articles" `
  -Method GET `
  -Headers $headers

# Create article
Invoke-RestMethod -Uri "http://localhost:3001/api/articles" `
  -Method POST `
  -Headers $headers `
  -ContentType "application/json" `
  -Body '{"title":"Test Article","content":"Content here","status":"draft"}'
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## CORS Configuration

The backend is configured to accept requests from:
```
http://localhost:3000 (Frontend)
```

If you need to add more origins, update the `.env` file:
```env
FRONTEND_URL=http://localhost:3000,http://localhost:3001
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:
- Login endpoint: 5 requests per minute
- API endpoints: 100 requests per minute
- File upload: 10 requests per minute

---

## Notes

1. All authenticated endpoints require `Authorization: Bearer <TOKEN>` header
2. JWT tokens expire after 24 hours (configurable in `.env`)
3. Admin-only endpoints check for `ADMIN` or `SUPER_ADMIN` role
4. Pagination defaults: page=1, size=10
5. All timestamps are in ISO 8601 format (UTC)
