# ADMIN API DOCUMENTATION

## Overview

The Admin API provides comprehensive authentication and user management functionality for system administrators. This module handles admin registration, login, profile management, password changes, and admin status updates. All endpoints require proper authentication except for registration and login.

### Base URL
```
/api/v1/admin
```

### Authentication
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Required for**: All endpoints except `/auth/register` and `/auth/login`

### Response Format
All responses follow a consistent JSON structure:
```json
{
  "success": boolean,
  "message": string,
  "data": object|array|null,
  "errors": array|null
}
```

## Data Models

### Admin
```typescript
interface Admin {
  adminId: number;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Register Request
```typescript
interface AdminRegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'super_admin' | 'admin';
}
```

### Login Request
```typescript
interface AdminLoginRequest {
  email: string;
  password: string;
}
```

### Update Profile Request
```typescript
interface AdminUpdateRequest {
  username?: string;
  email?: string;
}
```

### Change Password Request
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

### Update Status Request
```typescript
interface UpdateStatusRequest {
  isActive: boolean;
}
```

## Endpoints

### 1. Register Admin
**Endpoint**: `POST /auth/register`  
**Description**: Register a new admin account  
**Authentication**: Not required  
**Validation**: Uses Zod schema validation

#### Request Body
```json
{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "securepassword123",
  "role": "admin"
}
```

#### Response (Success - 201)
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "adminId": 1,
    "username": "admin_user",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-12-08T10:00:00.000Z",
    "updatedAt": "2025-12-08T10:00:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["username"],
      "message": "Required"
    }
  ]
}
```

- **409 Conflict** (Email/Username Exists):
```json
{
  "success": false,
  "message": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

### 2. Login Admin
**Endpoint**: `POST /auth/login`  
**Description**: Authenticate admin and receive JWT token  
**Authentication**: Not required  
**Validation**: Uses Zod schema validation

#### Request Body
```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "adminId": 1,
      "username": "admin_user",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
- **400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

- **401 Unauthorized** (Invalid Credentials):
```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

- **401 Unauthorized** (Account Inactive):
```json
{
  "success": false,
  "message": "Account is deactivated",
  "code": "ACCOUNT_INACTIVE"
}
```

### 3. Get Profile
**Endpoint**: `GET /auth/profile`  
**Description**: Retrieve current admin's profile information  
**Authentication**: Required (JWT token)

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "adminId": 1,
    "username": "admin_user",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-12-08T10:00:00.000Z",
    "updatedAt": "2025-12-08T10:00:00.000Z"
  }
}
```

#### Error Responses
- **401 Unauthorized** (No Authentication):
```json
{
  "success": false,
  "message": "Authentication required",
  "code": "NO_AUTH"
}
```

- **404 Not Found** (Admin Not Found):
```json
{
  "success": false,
  "message": "Admin not found",
  "code": "ADMIN_NOT_FOUND"
}
```

### 4. Change Password
**Endpoint**: `PUT /auth/change-password`  
**Description**: Change current admin's password  
**Authentication**: Required (JWT token)

#### Request Body
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword123"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "adminId": 1,
    "username": "admin_user",
    "email": "admin@example.com",
    "updatedAt": "2025-12-08T11:00:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Missing Fields):
```json
{
  "success": false,
  "message": "Current password and new password are required",
  "code": "MISSING_FIELDS"
}
```

- **400 Bad Request** (Password Too Short):
```json
{
  "success": false,
  "message": "New password must be at least 8 characters",
  "code": "PASSWORD_TOO_SHORT"
}
```

- **400 Bad Request** (Invalid Current Password):
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "code": "INVALID_CURRENT_PASSWORD"
}
```

### 5. Update Profile
**Endpoint**: `PUT /auth/update-profile`  
**Description**: Update current admin's profile information  
**Authentication**: Required (JWT token)  
**Validation**: Uses Zod schema validation

#### Request Body
```json
{
  "username": "new_admin_user",
  "email": "newadmin@example.com"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "adminId": 1,
    "username": "new_admin_user",
    "email": "newadmin@example.com",
    "role": "admin",
    "isActive": true,
    "updatedAt": "2025-12-08T11:30:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

- **409 Conflict** (Email/Username Exists):
```json
{
  "success": false,
  "message": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

### 6. Update Admin Status
**Endpoint**: `PUT /admins/:id/status`  
**Description**: Activate or deactivate another admin account  
**Authentication**: Required (JWT token)  
**Permissions**: Super admin only (role: 'super_admin')

#### URL Parameters
- `id`: Admin ID to update (number)

#### Request Body
```json
{
  "isActive": false
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Admin status updated successfully",
  "data": {
    "adminId": 2,
    "username": "other_admin",
    "email": "other@example.com",
    "role": "admin",
    "isActive": false,
    "updatedAt": "2025-12-08T12:00:00.000Z"
  }
}
```

#### Error Responses
- **400 Bad Request** (Invalid Input):
```json
{
  "success": false,
  "message": "isActive must be a boolean",
  "code": "INVALID_INPUT"
}
```

## Business Rules

### Registration
1. **Username Requirements**:
   - Must be unique across all admins
   - Cannot be empty
   - Should follow standard username conventions

2. **Email Requirements**:
   - Must be unique across all admins
   - Must be valid email format
   - Cannot be empty

3. **Password Requirements**:
   - Minimum 8 characters (enforced in change password, but registration may have additional rules)
   - Should include complexity requirements (handled by service layer)

4. **Role Assignment**:
   - Default role is 'admin'
   - Only super admins can assign 'super_admin' role
   - Role cannot be changed after registration

### Authentication
1. **Login Attempts**:
   - No explicit rate limiting shown in controller
   - Failed login returns generic error message

2. **Token Management**:
   - JWT tokens issued upon successful login
   - Token validity handled by middleware
   - No token refresh mechanism shown

3. **Account Status**:
   - Inactive accounts cannot login
   - Only super admins can change account status

### Profile Management
1. **Self-Update Restrictions**:
   - Admins can update their own username and email
   - Cannot change their own role
   - Cannot deactivate their own account

2. **Password Changes**:
   - Must provide current password for verification
   - New password must be at least 8 characters
   - Password change updates the admin record

### Admin Status Management
1. **Permission Requirements**:
   - Only super admins can update other admins' status
   - Admins cannot deactivate themselves

2. **Status Changes**:
   - Setting `isActive: false` deactivates the account
   - Deactivated accounts cannot login
   - Status change affects immediate access

## Error Handling

### Common Error Codes
- `EMAIL_EXISTS`: Email already registered
- `USERNAME_EXISTS`: Username already taken
- `DUPLICATE_ENTRY`: Email or username already exists
- `INVALID_CREDENTIALS`: Invalid login credentials
- `ACCOUNT_INACTIVE`: Account is deactivated
- `ADMIN_NOT_FOUND`: Admin not found
- `NO_AUTH`: Authentication required
- `MISSING_FIELDS`: Required fields missing
- `PASSWORD_TOO_SHORT`: Password too short
- `INVALID_CURRENT_PASSWORD`: Current password incorrect
- `INVALID_INPUT`: Invalid input data

### Validation Errors
All validation errors follow Zod error format with detailed field-level error messages.

## Usage Examples

### Complete Admin Workflow

#### 1. Register Super Admin
```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "email": "superadmin@example.com",
    "password": "SuperSecure123!",
    "role": "super_admin"
  }'
```

#### 2. Login as Super Admin
```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "SuperSecure123!"
  }'
```

#### 3. Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/admin/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Register Regular Admin
```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "regularadmin",
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "role": "admin"
  }'
```

#### 5. Update Admin Status (as Super Admin)
```bash
curl -X PUT http://localhost:3000/api/v1/admin/admins/2/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

#### 6. Change Password
```bash
curl -X PUT http://localhost:3000/api/v1/admin/auth/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SuperSecure123!",
    "newPassword": "NewSuperSecure456!"
  }'
```

#### 7. Update Profile
```bash
curl -X PUT http://localhost:3000/api/v1/admin/auth/update-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updated_superadmin",
    "email": "updated@example.com"
  }'
```

## Security Considerations

1. **Password Storage**: Passwords are hashed before storage (handled by service layer)
2. **JWT Security**: Tokens should have reasonable expiration times
3. **Rate Limiting**: Consider implementing rate limiting for login attempts
4. **Audit Logging**: All admin actions should be logged for security auditing
5. **Role-Based Access**: Ensure proper permission checks for sensitive operations

## Notes

- The `verifyToken` endpoint is currently commented out in the controller
- Super admin role has elevated permissions for managing other admins
- All timestamps are in ISO 8601 format
- Email and username uniqueness is enforced at the database level
- Password complexity rules may be implemented in the service layer