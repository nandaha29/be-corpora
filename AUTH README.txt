# Admin Authentication System

This document explains the admin authentication system implemented for the Leksikon project.

## Overview

The authentication system provides secure admin login/registration with JWT tokens and role-based access control.

## Features

- ✅ Admin registration and login
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (SUPER_ADMIN, EDITOR, VIEWER)
- ✅ Protected admin routes
- ✅ Profile management and password change

## Database Schema

The `Admin` table includes:
- `adminId` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `role` (AdminRole enum)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Register Admin
```http
POST /api/v1/admin/auth/register
Content-Type: application/json

{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "securepassword123",
  "role": "EDITOR"
}
```

#### Login Admin
```http
POST /api/v1/admin/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

### Protected Endpoints (Require Authentication)

All admin endpoints require a Bearer token:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Profile
```http
GET /api/v1/admin/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Change Password
```http
PUT /api/v1/admin/auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Roles & Permissions

- **SUPER_ADMIN**: Full access to all features
- **EDITOR**: Can create, edit, and manage content
- **VIEWER**: Read-only access to admin features

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/leksikon_db
```

## Usage Examples

### 1. Register First Admin
```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "email": "admin@leksikon.com",
    "password": "securepassword123",
    "role": "SUPER_ADMIN"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@leksikon.com",
    "password": "securepassword123"
  }'
```

### 3. Use Token for Protected Routes
```bash
curl -X GET http://localhost:3000/api/v1/admin/cultures \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Security Notes

- Passwords are hashed with bcrypt (12 salt rounds)
- JWT tokens expire in 24 hours
- All admin routes are protected by authentication middleware
- Role-based middleware available for granular permissions
- Change the JWT_SECRET in production!

## File Structure

```
src/
├── controllers/admin/
│   └── admin.controller.ts     # Auth endpoints
├── services/admin/
│   └── admin.service.ts        # Auth business logic
├── routes/admin/
│   └── admin.routes.ts         # Auth routes
├── middleware/
│   └── auth.middleware.ts      # Authentication middleware
└── lib/
    └── validators.ts           # Auth validation schemas
```

## Testing

Run the test script to see example API calls:
```bash
node test-auth.js
```

## Migration

If you need to create the initial admin user, you can temporarily disable authentication on the register endpoint or create the user directly in the database.