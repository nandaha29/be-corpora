# Leksikon Backend API

## 📋 Deskripsi Proyek

Leksikon Backend API adalah sistem backend untuk mengelola database leksikon budaya Indonesia. Sistem ini menyediakan API RESTful untuk mengelola data budaya, subkultur, domain kodifikasi, leksikon, referensi, kontributor, dan aset media.

## 🏗️ Arsitektur Sistem

### Technology Stack
- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js v5.1.0
- **ORM**: Prisma v6.16.2
- **Database**: PostgreSQL dengan PostGIS (untuk data geografis)
- **Authentication**: JWT (jsonwebtoken) dengan bcrypt untuk password hashing
- **File Storage**: Vercel Blob Storage
- **File Upload**: Multer untuk handling multipart/form-data
- **Validation**: Zod untuk schema validation

### Arsitektur Multi-Layer
1. **Client Layer**: Frontend applications (React/Next.js)
2. **API Gateway**: Express.js router dengan middleware
3. **Backend Services**: Service layer untuk business logic
4. **Database Layer**: PostgreSQL dengan Prisma ORM
5. **Cloud Storage Layer**: Vercel Blob untuk media files

## 📊 Model Data

### Entity Utama
- **Admin**: User management untuk admin FIB
- **Culture**: Data budaya utama
- **Subculture**: Subkultur dalam budaya
- **CodificationDomain**: Domain kodifikasi untuk klasifikasi leksikon
- **Lexicon**: Entri leksikon dengan detail lengkap
- **Contributor**: Kontributor dan koordinator penelitian
- **Asset**: Media files (PHOTO, AUDIO, VIDEO, MODEL_3D)
- **Reference**: Referensi akademik (JURNAL, BUKU, ARTIKEL, WEBSITE, LAPORAN, THESIS, DISSERTATION, FIELD_NOTE)

### Relasi Many-to-Many
- Lexicon ↔ Asset (dengan role: GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D)
- Lexicon ↔ Reference (dengan citation note)
- Subculture ↔ Asset (dengan role: HIGHLIGHT, THUMBNAIL, GALLERY, BANNER, VIDEO_DEMO, MODEL_3D)
- Culture ↔ Asset (dengan role: HIGHLIGHT, THUMBNAIL, GALLERY, BANNER, VIDEO_DEMO, MODEL_3D)
- Contributor ↔ Asset (dengan role: LOGO, SELF_PHOTO, SIGNATURE, CERTIFICATE, GALLERY, VIDEO_DEMO)

## 🔐 Authentication & Authorization

### Admin Roles
- **SUPER_ADMIN**: Full access
- **EDITOR**: Can create, update, delete content
- **VIEWER**: Read-only access

### Authentication Flow
1. Register/Login → JWT token generation
2. Protected routes require `Authorization: Bearer <token>`
3. Middleware `authenticateAdmin` validates token

## 📡 API Endpoints Overview

### Admin Endpoints (Protected)
- **Authentication**: `/api/v1/admin/auth/*`
- **Leksikon Management**: `/api/v1/admin/leksikons/*`
- **Domain Kodifikasi**: `/api/v1/admin/domain-kodifikasi/*`
- **Subculture Management**: `/api/v1/admin/subcultures/*`
- **Culture Management**: `/api/v1/admin/cultures/*`
- **Contributor Management**: `/api/v1/admin/contributors/*`
- **Reference Management**: `/api/v1/admin/references/*`
- **Asset Management**: `/api/v1/admin/assets/*`

### Public Endpoints
- **Landing Page**: `/api/v1/public/landing/*`
- **Lexicon**: `/api/v1/public/lexicons/*`
- **Subculture**: `/api/v1/public/subcultures/*`
- **Search**: `/api/v1/search/*`
- **Domain**: `/api/v1/domains/*`
- **Culture**: `/api/v1/public/cultures/*`
- **Region**: `/api/v1/public/regions/*`
- **Reference**: `/api/v1/public/references/*`
- **Contributor**: `/api/v1/public/contributors/*`
- **Asset**: `/api/v1/public/assets/*`

## 🚀 Fitur Utama

### 1. CRUD Operations
- Full CRUD untuk semua entitas utama
- Pagination support untuk semua list endpoints
- Soft delete dengan status management (DRAFT, PUBLISHED, ARCHIVED)

### 2. Search & Filtering
- Global search across all content types
- Advanced search dengan multiple filters
- Geographic filtering dengan PostGIS
- Domain kodifikasi filtering
- Status-based filtering

### 3. Media Management
- Single & bulk file upload
- Support untuk PHOTO, AUDIO, VIDEO, MODEL_3D
- Asset role management (GALLERY, THUMBNAIL, BANNER, dll)
- Public asset access dengan status check

### 4. Bulk Import
- CSV import untuk leksikon
- Flexible header mapping
- Batch processing dengan error handling
- Import summary dengan success/skipped/errors

### 5. Usage Tracking
- Track asset usage across leksikons
- Track reference usage
- Orphan data detection
- Usage statistics

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan database URL dan konfigurasi lainnya

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://..."
BLOB_READ_WRITE_TOKEN="..."
JWT_SECRET="..."
PORT=8000
```

## 📝 Status Publish

Semua entitas utama menggunakan status publish:
- **DRAFT**: Belum dipublikasikan
- **PUBLISHED**: Tersedia untuk public
- **ARCHIVED**: Diarsipkan

## 🎯 Use Cases

### Admin FIB
- Manage semua konten leksikon
- Upload dan manage media assets
- Manage referensi akademik
- Bulk import data dari Excel/CSV
- Track usage dan statistics

### Researcher
- Access public API untuk penelitian
- Search dan filter leksikon
- Access published references
- Geographic data exploration

### Public Visitor
- Browse leksikon yang dipublikasikan
- Search leksikon berdasarkan berbagai kriteria
- View subculture gallery
- Access media assets (published only)

## 📈 Statistics & Analytics

Sistem menyediakan:
- Content statistics (jumlah leksikon, subkultur, budaya)
- Usage tracking untuk assets dan references
- Geographic distribution data
- Conservation status tracking

## 🔒 Security Features

- Password hashing dengan bcrypt
- JWT token authentication
- Role-based access control
- File upload validation
- SQL injection protection (Prisma ORM)
- CORS configuration

## 📚 Documentation

Untuk dokumentasi lengkap endpoint dan penggunaan untuk skripsi, lihat `README_SKRIPSI.md`.

## 🛠️ Development

```bash
# Development dengan hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Format code
npx prettier --write .
```

## 📄 License

ISC

