# 📋 TEKNIS IMPLEMENTASI BACKEND API LEKSIKON
## Dokumentasi Lengkap untuk Skripsi

*Last Updated: December 21, 2025*

---

## 📋 Daftar Isi

1. [Arsitektur Deployment (5.1.1)](#51-arstektur-deployment)
2. [Technology Stack Detail (5.1.2)](#52-technology-stack-detail)
3. [RESTful API Design Principles (5.1.3)](#53-restful-api-design-principles)
4. [File/Folder Structure Backend](#54-filefolder-structure-backend)
5. [Port & Environment Variables](#55-port--environment-variables)

---

## 5.1 Arsitektur Deployment

### 5.1.1 Arsitektur Sistem Lengkap

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Frontend Application (React/Next.js)                           │ │
│  │ - Deployed on: Vercel                                          │ │
│  │ - Domain: https://ubcorpora.vercel.app                         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ HTTPS Request
┌─────────────────▼───────────────────────────────────────────────────────┐
│                        VERCEL EDGE NETWORK                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ CDN & Hosting Layer                                             │   │
│  │ - Service: Vercel Global CDN                                   │   │
│  │ - Features: Edge computing, automatic SSL, DDoS protection    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ API Call (/api/v1/*)
┌─────────────────▼───────────────────────────────────────────────────────┐
│                       BACKEND LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Backend API (Node.js + Express.js)                              │   │
│  │ - Deployed on: Vercel Serverless Functions                     │   │
│  │ - Runtime: Node.js (Serverless)                                │   │
│  │ - Domain: https://be-corpora.vercel.app                        │   │
│  │ - Scaling: Automatic (0-∞ instances)                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ Database Query
┌─────────────────▼───────────────────────────────────────────────────────┐
│                       DATABASE LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ PostgreSQL Database                                             │   │
│  │ - Service: Neon (neon.tech)                                     │   │
│  │ - Type: Serverless PostgreSQL                                  │   │
│  │ - Connection: Connection pooling, auto-scaling                 │   │
│  │ - Backup: Automatic daily backups                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ File Upload/Download
┌─────────────────▼───────────────────────────────────────────────────────┐
│                      STORAGE LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Object Storage                                                  │   │
│  │ - Service: Vercel Blob Storage                                  │   │
│  │ - Features: Global CDN, automatic optimization                 │   │
│  │ - Integration: Native Vercel integration                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Deployment Architecture Summary

| Layer | Service | Provider | Key Features |
|-------|---------|----------|--------------|
| **Client** | Vercel Hosting | Vercel | Global CDN, SSR/SSG, Edge Functions |
| **Backend** | Vercel Serverless | Vercel | Auto-scaling, 0 cold starts, Global distribution |
| **Database** | PostgreSQL (Neon) | Neon | Serverless, auto-scaling, connection pooling |
| **Storage** | Vercel Blob | Vercel | Global CDN, image optimization, streaming |

### Deployment Benefits

1. **Zero Maintenance**: Fully managed services
2. **Auto-scaling**: Handle traffic spikes automatically
3. **Global Performance**: Edge network reduces latency
4. **Cost-effective**: Pay-per-use pricing model
5. **Developer Experience**: Single platform for all services

---

## 5.2 Technology Stack Detail

### 5.2.1 Runtime & Core Framework

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | 22.x (via @tsconfig/node22) | JavaScript runtime environment |
| **Framework** | Express.js | 5.1.0 | Web application framework |
| **Language** | TypeScript | 5.9.2 | Type-safe JavaScript superset |
| **ORM** | Prisma | 6.16.2 | Database ORM with type generation |
| **Database** | PostgreSQL | Latest (via Neon) | Relational database |

### 5.2.2 Package Dependencies (Production)

#### Core Dependencies (`package.json`)
```json
{
  "dependencies": {
    "@prisma/client": "^6.16.2",      // Prisma database client
    "@vercel/blob": "^2.0.0",         // Vercel Blob Storage SDK
    "bcrypt": "^6.0.0",               // Password hashing
    "cors": "^2.8.5",                 // Cross-Origin Resource Sharing
    "csv-parser": "^3.2.0",           // CSV file parsing for bulk import
    "dotenv": "^17.2.2",              // Environment variables
    "express": "^5.1.0",              // Web framework
    "jsonwebtoken": "^9.0.2",         // JWT token handling
    "multer": "^2.0.2",               // File upload middleware
    "prisma": "^6.16.2",              // Database toolkit
    "zod": "^4.1.11"                  // Schema validation
  }
}
```

#### Dependency Functions
- **@prisma/client**: Type-safe database queries
- **@vercel/blob**: File upload/download to Vercel Blob Storage
- **bcrypt**: Secure password hashing for admin authentication
- **cors**: Enable cross-origin requests from frontend
- **csv-parser**: Parse CSV files for bulk lexicon import
- **dotenv**: Load environment variables from .env file
- **express**: HTTP server and routing
- **jsonwebtoken**: Generate and verify JWT tokens
- **multer**: Handle multipart/form-data (file uploads)
- **prisma**: Database schema management and migrations
- **zod**: Runtime type validation for API requests

### 5.2.3 Development Tools

#### Development Dependencies
```json
{
  "devDependencies": {
    "@tsconfig/node22": "^22.0.2",     // TypeScript config for Node.js 22
    "@types/bcrypt": "^6.0.0",         // TypeScript types for bcrypt
    "@types/cors": "^2.8.19",          // TypeScript types for cors
    "@types/express": "^5.0.3",        // TypeScript types for express
    "@types/jsonwebtoken": "^9.0.10",  // TypeScript types for jsonwebtoken
    "@types/multer": "^2.0.0",         // TypeScript types for multer
    "@types/node": "^24.5.2",          // TypeScript types for Node.js
    "nodemon": "^3.1.10",              // Development server auto-restart
    "prettier": "^3.6.2",              // Code formatter
    "ts-node": "^10.9.2",              // TypeScript execution in Node.js
    "tsx": "^4.20.6",                  // Enhanced TypeScript execution
    "typescript": "^5.9.2"             // TypeScript compiler
  }
}
```

#### Development Tools Usage
- **@tsconfig/node22**: Standardized TypeScript configuration
- **@types/***: TypeScript type definitions for external libraries
- **nodemon**: Auto-restart server during development
- **prettier**: Consistent code formatting
- **ts-node/tsx**: Run TypeScript files directly
- **typescript**: Compile TypeScript to JavaScript

### 5.2.4 API Testing & Containerization

#### API Testing Tools
- **Primary**: Postman (for API documentation and testing)
- **Alternative**: Bruno (open-source API client)
- **Method**: Manual testing via GUI client

#### Containerization
- **Status**: Not containerized (Docker not used)
- **Reason**: Vercel serverless deployment doesn't require containers
- **Alternative**: Vercel handles deployment packaging automatically

### 5.2.5 Build & Development Scripts

#### NPM Scripts (`package.json`)
```json
{
  "scripts": {
    "build": "npx tsc",                           // Compile TypeScript to JavaScript
    "start": "node --es-module-specifier-resolution=node dist/index.js",  // Production start
    "dev": "tsx watch --include='./src/*' src/index.ts",  // Development with hot reload
    "postinstall": "prisma generate"               // Generate Prisma client after install
  }
}
```

#### Development Workflow
1. **Development**: `npm run dev` (tsx watch mode)
2. **Build**: `npm run build` (TypeScript compilation)
3. **Production**: `npm start` (serve compiled JavaScript)
4. **Database**: `prisma generate` (after dependency installation)

---

## 5.3 RESTful API Design Principles

### 5.3.1 Base URL & Versioning

#### Base URL Structure
```
Production:  https://be-corpora.vercel.app/api/v1
Development: http://localhost:8000/api/v1
```

#### Versioning Strategy
- **Method**: URL Path Versioning (`/v1/`)
- **Current Version**: v1 (initial release)
- **Version Location**: After base path
- **Example**: `https://be-corpora.vercel.app/api/v1/admin/leksikons`

#### URL Structure Pattern
```
/api/v1/{resource_type}/{resource_id}/{sub_resource}/{sub_resource_id}
```

### 5.3.2 Authentication Method

#### JWT Bearer Token Authentication
- **Type**: Bearer Token (RFC 6750)
- **Header**: `Authorization: Bearer <token>`
- **Token Generation**: On successful login
- **Token Verification**: Via middleware for protected routes

#### Authentication Flow
```javascript
// 1. Login Request
POST /api/v1/admin/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}

// 2. Response with Token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": { "adminId": 1, "username": "admin" }
}

// 3. Authenticated Request
GET /api/v1/admin/leksikons
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Route Protection
- **Public Routes**: `/api/v1/public/*`, `/api/v1/search/*`, `/api/v1/admin/auth/*`
- **Protected Routes**: All `/api/v1/admin/*` except auth endpoints
- **Middleware**: `authenticateAdmin` function in `auth.middleware.ts`

### 5.3.3 CORS Policy

#### CORS Configuration
```typescript
// In src/index.ts
app.use(cors()); // Enable CORS for all origins
```

#### CORS Policy Details
- **Allow Origins**: All origins (`*`)
- **Allow Methods**: All HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- **Allow Headers**: All headers including Authorization
- **Credentials**: Not required (since using Bearer tokens)

#### Security Consideration
- **Development**: CORS enabled for all origins (flexible development)
- **Production**: CORS enabled for all origins (Vercel handles security)
- **Reason**: API serves web application on different domain

### 5.3.4 HTTP Status Codes

#### Standard Response Format
```typescript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

#### Status Code Usage
- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST requests (resource creation)
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing/invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (duplicate data)
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server errors

### 5.3.5 Request/Response Patterns

#### Pagination
```typescript
// Request with pagination
GET /api/v1/admin/leksikons?page=1&limit=10&status=PUBLISHED

// Response with pagination metadata
{
  "success": true,
  "data": {
    "leksikons": [/* array of lexicons */],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

#### Filtering & Sorting
```typescript
// Multiple filters
GET /api/v1/admin/leksikons?status=PUBLISHED&domainId=1&sortBy=createdAt&order=desc

// Search query
GET /api/v1/search/global?query=budaya&culture=jawa&limit=20
```

#### File Upload
```typescript
// Multipart form data
POST /api/v1/admin/assets/upload
Content-Type: multipart/form-data
Body: {
  file: <binary file data>,
  fileName: "example.jpg",
  fileType: "PHOTO"
}
```

---

## 5.4 File/Folder Structure Backend

### 5.4.1 Root Directory Structure

```
leksikon-be-2/
├── 📁 src/                          # Source code directory
│   ├── 📄 index.ts                  # Application entry point
│   ├── 📁 controllers/              # Request handlers (Controller Layer)
│   │   ├── 📁 admin/                # Admin controllers
│   │   └── 📁 public/               # Public controllers
│   ├── 📁 services/                 # Business logic (Service Layer)
│   │   ├── 📁 admin/                # Admin services
│   │   └── 📁 public/               # Public services
│   ├── 📁 middleware/               # Express middleware
│   ├── 📁 routes/                   # Route definitions
│   │   ├── 📁 admin/                # Admin routes
│   │   └── 📁 public/               # Public routes
│   └── 📁 lib/                      # Utilities and configurations
│       ├── 📄 prisma.ts             # Prisma client instance
│       ├── 📄 validators.ts         # Zod validation schemas
│       └── 📄 public.validator.ts   # Public API validators
├── 📁 prisma/                       # Database schema and migrations
│   ├── 📄 schema.prisma             # Database schema definition
│   └── 📁 migrations/               # Database migration files
├── 📁 scripts/                      # Utility scripts
├── 📁 script_input_db/              # Database operation scripts
├── 📁 FILE README/                  # Documentation files
├── 📁 SKRIPSI_DIAGRAMS/             # Diagrams for thesis
├── 📁 temp-uploads/                 # Temporary file uploads
├── 📁 uploads/                      # Processed uploads
├── 📄 package.json                  # Dependencies and scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 .env.example                  # Environment variables template
└── 📄 README.md                     # Project documentation
```

### 5.4.2 Source Code Organization (Layered Architecture)

#### 1. Entry Point Layer (`src/index.ts`)
- **Purpose**: Application bootstrap and route mounting
- **Responsibilities**:
  - Express app initialization
  - Middleware configuration (CORS, JSON parsing)
  - Route registration with authentication middleware
  - Server startup

#### 2. Route Layer (`src/routes/`)
```
src/routes/
├── admin/                           # Protected admin routes
│   ├── admin.routes.ts             # Authentication routes
│   ├── culture.routes.ts           # Culture management
│   ├── contributor.routes.ts       # Contributor management
│   ├── reference.routes.ts         # Reference management
│   ├── asset.routes.ts             # Asset management
│   ├── subculture.routes.ts        # Subculture management
│   ├── leksikon.routes.ts          # Lexicon management
│   ├── domainKodifikasi.routes.ts  # Domain management
│   ├── reference-junction.routes.ts # Reference assignments
│   └── about-reference.routes.ts   # About page references
└── public/                         # Public routes (no auth)
    ├── landingPage.routes.ts       # Landing page data
    ├── subculture.routes.ts        # Public subculture access
    ├── lexicon.routes.ts           # Public lexicon access
    ├── search.routes.ts            # Search functionality
    ├── culture.routes.ts           # Public culture access
    ├── reference.routes.ts         # Public reference access
    ├── contributor.routes.ts       # Public contributor access
    ├── asset.routes.ts             # Public asset access
    ├── about.routes.ts             # About page data
    ├── domain.routes.ts            # Domain list
    └── region.routes.ts            # Region data
```

#### 3. Controller Layer (`src/controllers/`)
```
src/controllers/
├── admin/                          # Admin controllers
│   ├── admin.controller.ts         # Authentication logic
│   ├── culture.controller.ts       # Culture CRUD operations
│   ├── contributor.controller.ts   # Contributor CRUD operations
│   ├── reference.controller.ts     # Reference CRUD operations
│   ├── asset.controller.ts         # Asset CRUD operations
│   ├── subculture.controller.ts    # Subculture CRUD operations
│   ├── leksikon.controller.ts      # Lexicon CRUD operations
│   ├── domainKodifikasi.controller.ts # Domain CRUD operations
│   ├── reference-junction.controller.ts # Reference assignment logic
│   └── about-reference.controller.ts # About reference logic
└── public/                         # Public controllers
    ├── landingPage.controller.ts   # Landing page data
    ├── search.controller.ts        # Search operations
    └── [other public controllers]
```

#### 4. Service Layer (`src/services/`)
```
src/services/
├── admin/                          # Business logic for admin operations
│   ├── culture.service.ts          # Culture business logic
│   ├── contributor.service.ts      # Contributor business logic
│   ├── reference.service.ts        # Reference business logic
│   ├── asset.service.ts           # Asset business logic
│   ├── subculture.service.ts      # Subculture business logic
│   ├── leksikon.service.ts        # Lexicon business logic
│   ├── domainKodifikasi.service.ts # Domain business logic
│   ├── reference-junction.service.ts # Reference assignment logic
│   └── about-reference.service.ts # About reference logic
└── public/                         # Business logic for public operations
    ├── search.service.ts           # Search business logic
    └── [other public services]
```

#### 5. Middleware Layer (`src/middleware/`)
```
src/middleware/
└── auth.middleware.ts              # JWT authentication middleware
```

#### 6. Library Layer (`src/lib/`)
```
src/lib/
├── prisma.ts                       # Prisma client configuration
├── validators.ts                   # Zod validation schemas for admin APIs
└── public.validator.ts             # Zod validation schemas for public APIs
```

### 5.4.3 Architecture Benefits

#### Separation of Concerns
- **Routes**: Handle HTTP routing and middleware application
- **Controllers**: Process requests and format responses
- **Services**: Contain business logic and database operations
- **Validators**: Handle input validation and type checking

#### Scalability
- **Modular Structure**: Easy to add new features
- **Layer Isolation**: Changes in one layer don't affect others
- **Testability**: Each layer can be tested independently

#### Maintainability
- **Clear Organization**: Easy to locate and modify code
- **Type Safety**: TypeScript ensures compile-time error checking
- **Documentation**: JSDoc comments in all files

---

## 5.5 Port & Environment Variables

### 5.5.1 Server Port Configuration

#### Port Settings
```typescript
// In src/index.ts
const port = process.env.PORT || 8000;
```

#### Port Details
- **Default Port**: 8000
- **Environment Variable**: `PORT`
- **Development**: `http://localhost:8000`
- **Production**: Handled by Vercel (dynamic port assignment)

#### Vercel Deployment
- **Serverless**: No fixed port binding
- **Dynamic Ports**: Vercel assigns ports automatically
- **Environment**: `process.env.PORT` provided by Vercel runtime

### 5.5.2 Environment Variables

#### Required Environment Variables

##### Database Configuration
```bash
# PostgreSQL Database (Neon)
DATABASE_URL="postgresql://username:password@hostname:5432/database"
```
- **Purpose**: Connection string for Prisma ORM
- **Provider**: Neon PostgreSQL
- **Format**: Standard PostgreSQL connection string
- **Security**: Contains credentials (keep secret)

##### JWT Configuration
```bash
# JWT Token Settings
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
```
- **JWT_SECRET**: Secret key for signing JWT tokens (must be strong and unique)
- **JWT_EXPIRES_IN**: Token expiration time (24 hours for admin sessions)

##### Server Configuration
```bash
# Server Settings
PORT=8000
NODE_ENV="development"
```
- **PORT**: Server port (default: 8000, overridden by Vercel in production)
- **NODE_ENV**: Environment mode (development/production)

##### File Storage (Optional for Development)
```bash
# Vercel Blob Storage (Production)
BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"
```
- **Purpose**: Access token for Vercel Blob Storage
- **Required**: Only for file upload functionality
- **Development**: Can be omitted (files stored locally)

### 5.5.3 Environment File Structure

#### `.env` File Template
```bash
# ===========================================
# LEKSIKON BACKEND ENVIRONMENT VARIABLES
# ===========================================

# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# JWT Configuration
JWT_SECRET="your-256-bit-secret-key-here-change-in-production"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=8000
NODE_ENV="development"

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_token_for_file_uploads"

# Optional: Additional security settings
# CORS_ORIGIN="https://your-frontend-domain.com"
```

#### `.env.example` (Version Controlled)
```bash
# Environment Variables Template
# Copy this to .env and fill in your values

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/leksikon_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=8000
NODE_ENV="development"

# Optional: Vercel Blob Storage (for file uploads)
# BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 5.5.4 Environment Variable Security

#### Security Best Practices
1. **Never Commit Secrets**: `.env` files are in `.gitignore`
2. **Use Strong Secrets**: JWT_SECRET should be 256-bit minimum
3. **Environment Separation**: Different values for dev/staging/production
4. **Vercel Integration**: Environment variables set in Vercel dashboard

#### Vercel Environment Variables
- **Dashboard**: Set via Vercel project settings
- **CLI**: `vercel env add VARIABLE_NAME`
- **Scopes**: Can set different values for preview/production

### 5.5.5 Development vs Production Configuration

#### Development Setup
```bash
# .env (local development)
DATABASE_URL="postgresql://user:pass@localhost:5432/leksikon_dev"
JWT_SECRET="dev-secret-key-12345"
PORT=8000
NODE_ENV="development"
```

#### Production Setup (Vercel)
```bash
# Vercel Environment Variables
DATABASE_URL="postgresql://user:pass@neon-host:5432/leksikon_prod"
JWT_SECRET="prod-super-secret-key-256-bit"
NODE_ENV="production"
BLOB_READ_WRITE_TOKEN="vercel_blob_prod_token"
# PORT automatically assigned by Vercel
```

---

## 📚 References

1. **Express.js Documentation**: https://expressjs.com/
2. **Prisma Documentation**: https://www.prisma.io/docs
3. **Vercel Platform**: https://vercel.com/docs
4. **Neon PostgreSQL**: https://neon.tech/docs
5. **JWT.io**: https://jwt.io/
6. **Zod Validation**: https://zod.dev/

---

*This document provides comprehensive technical details for the Leksikon Backend API implementation in the thesis.*