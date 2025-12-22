# Leksikon Backend API

*Last Updated: December 22, 2025*

## ✅ Project Verification Status

**✅ VERIFIED & READY FOR THESIS** - December 22, 2025

All components of this project have been thoroughly verified and are ready for thesis documentation:

- **API Endpoints**: All documented endpoints are functional and tested
- **Database Schema**: All models and relationships are properly implemented
- **Authentication**: JWT authentication system is working correctly
- **File Upload**: Media asset upload and management is operational
- **Bulk Import**: CSV import functionality is tested and working
- **Sequence Diagrams**: All SD01-SD10 diagrams match actual implementation
- **Use Case Mapping**: UC-SD mapping is 100% accurate with project code
- **Documentation**: All API documentation files are up-to-date

**Status**: 🟢 **PRODUCTION READY** | **TESTED** | **DOCUMENTED**

## 📋 Deskripsi Proyek

Leksikon Backend API adalah sistem backend untuk mengelola database leksikon budaya Indonesia. Sistem ini menyediakan API RESTful untuk mengelola data budaya, subkultur, domain kodifikasi, leksikon, referensi, kontributor, dan aset media.

## 🔍 Verification Summary

**Project Status**: ✅ **FULLY VERIFIED** (December 22, 2025)

### What Has Been Verified:
- ✅ **API Implementation**: All endpoints match documentation
- ✅ **Database Relations**: All many-to-many relationships working
- ✅ **Authentication Flow**: JWT token validation functional
- ✅ **File Management**: Upload, storage, and retrieval working
- ✅ **Bulk Operations**: CSV import with error handling
- ✅ **Search & Filtering**: Advanced search capabilities tested
- ✅ **Sequence Diagrams**: SD01-SD10 accurately represent code flow
- ✅ **Use Case Mapping**: UC-SD alignment confirmed
- ✅ **Documentation**: All README files updated and accurate

### Key Features Verified:
- **CRUD Operations**: All entities support full CRUD
- **Asset Management**: Multi-role asset assignments working
- **Reference System**: Junction tables and citation notes functional
- **Public API**: All public endpoints accessible and tested
- **Admin Panel**: Authentication and authorization working
- **Data Import**: JSON and CSV import processes verified
- **Sequence Diagrams**: SD01-SD10 fully aligned with UC specifications
- **Documentation**: All diagrams and API docs match implementation

## 🏗️ Arsitektur Sistem

### Technology Stack
- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js v5.1.0
- **ORM**: Prisma v6.16.2
- **Database**: PostgreSQL
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
- **Culture**: Data budaya utama (dengan koordinat latitude/longitude)
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
- **About References**: `/api/v1/admin/about-references/*`
- **Reference Junctions**: `/api/v1/admin/reference-junctions/*`
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

## 📚 Reference Management API Details

### About References Endpoints
- **GET /api/v1/admin/about-references** - Retrieve all about references with display order
- **GET /api/v1/admin/about-references/:id** - Get specific about reference by ID
- **POST /api/v1/admin/about-references** - Create new about reference (body: referenceId, displayOrder?, isActive?)
- **PUT /api/v1/admin/about-references/:id** - Update about reference
- **DELETE /api/v1/admin/about-references/:id** - Delete about reference
- **PUT /api/v1/admin/about-references/reorder** - Reorder about references display order

### Reference Junctions Endpoints
- **POST /api/v1/admin/reference-junctions/lexicon/assign** - Assign reference to lexicon (body: lexiconId, referenceId, referenceRole?)
- **DELETE /api/v1/admin/reference-junctions/lexicon/:lexiconId/:referenceId** - Remove reference from lexicon
- **GET /api/v1/admin/reference-junctions/lexicon/:lexiconId** - Get references for lexicon
- **POST /api/v1/admin/reference-junctions/subculture/assign** - Assign reference to subculture
- **DELETE /api/v1/admin/reference-junctions/subculture/:subcultureId/:referenceId** - Remove reference from subculture
- **GET /api/v1/admin/reference-junctions/subculture/:subcultureId** - Get references for subculture
- **POST /api/v1/admin/reference-junctions/culture/assign** - Assign reference to culture
- **DELETE /api/v1/admin/reference-junctions/culture/:cultureId/:referenceId** - Remove reference from culture
- **GET /api/v1/admin/reference-junctions/culture/:cultureId** - Get references for culture
- **GET /api/v1/admin/reference-junctions/stats/:referenceId** - Get reference usage statistics

## 🚀 Fitur Utama

### 1. CRUD Operations
- Full CRUD untuk semua entitas utama
- Pagination support untuk semua list endpoints
- Soft delete dengan status management (DRAFT, PUBLISHED, ARCHIVED)

### 2. Search & Filtering
- Global search across all content types
- Advanced search dengan multiple filters
- Geographic filtering dengan koordinat latitude/longitude
- Domain kodifikasi filtering
- Status-based filtering

### 3. Media Management
- Single & bulk file upload dengan Multer
- Support untuk multiple file types: PHOTO, AUDIO, VIDEO, MODEL_3D
- Asset role management: GALLERY, THUMBNAIL, BANNER, HIGHLIGHT, PRONUNCIATION, VIDEO_DEMO, MODEL_3D, LOGO, SELF_PHOTO, SIGNATURE, CERTIFICATE
- Public asset access dengan status validation
- Vercel Blob Storage integration untuk scalable media hosting

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

### 6. Enhanced Search & Filtering 
- Combined search and filter capabilities in asset endpoints
- Status-based filtering (DRAFT, PUBLISHED, ARCHIVED)
- Advanced search with multiple criteria
- Geographic filtering with latitude/longitude coordinates
- Domain kodifikasi filtering with code validation

### 7. Comprehensive API Documentation
- Complete admin API documentation for all modules
- Public API endpoints documentation with frontend integration notes
- Detailed request/response examples
- Business rules and validation requirements
- Error handling and status codes

### 8. Reference Management 
- **About References**: Manage references displayed on about page with display order and reordering capabilities
- **Reference Junctions**: Assign references to lexicons, subcultures, and cultures with specific roles (PRIMARY_SOURCE, SECONDARY_SOURCE)
- **Reference Usage Statistics**: Track how references are used across different entities with detailed usage counts
- **Junction Table Management**: Handle many-to-many relationships between references and content entities
- **Citation Notes**: Support for custom citation notes in reference assignments

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

# Import initial data (optional)
node script_input_db/import_domains.js
node script_input_db/import_contributors.js
node script_input_db/import-database.js json

# Build for production
npm run build
npm start
```

## 📊 Data Import Status 

Sistem telah berhasil mengimpor data awal dari file JSON export:
- **Contributors**: 17 records imported
- **Codification Domains**: 13 records imported
- **Lexicons**: 131 records imported
- **Lexicon Assets**: 41 records imported
- **References**: 25 records (existing)
- **Assets**: 80 records (existing)
- **Cultures**: 15 records (existing)
- **Subcultures**: 25 records (existing)

Data import menggunakan script di `script_input_db/` dengan error handling untuk foreign key constraints.

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
- Manage referensi akademik dan assignment ke konten
- Manage about references untuk halaman about
- Bulk import data dari Excel/CSV dan JSON
- Track usage dan statistics untuk references dan assets

### Researcher
- Access public API untuk penelitian
- Search dan filter leksikon
- Access published references
- Geographic data exploration dengan koordinat latitude/longitude

### Public Visitor
- Browse leksikon yang dipublikasikan
- Search leksikon berdasarkan berbagai kriteria
- View subculture gallery
- Access media assets (published only)

## � Sequence Diagrams (SD) Documentation

**Status**: ✅ **FULLY VERIFIED & ALIGNED** (December 22, 2025)

All sequence diagrams (SD01-SD10) have been verified to accurately represent the actual implementation:

### Admin Use Cases (SD01-SD05)
- **SD01_Authenticate_via_JWT.puml**: JWT authentication flow with role validation
- **SD02_Manage_Leksikon_CRUD.puml**: Complete CRUD operations for lexicons
- **SD03_Upload_Media_Asset.puml**: File upload with validation and storage
- **SD04_Bulk_Import_from_CSV.puml**: CSV bulk import with error handling
- **SD05_Assign_Reference_to_Entity.puml**: Reference assignment with citation notes

### Public Use Cases (SD06-SD10)
- **SD06_Get_Published_Lexicons.puml**: Public lexicon listing with filtering
- **SD07_Search_Lexicons.puml**: Advanced search functionality
- **SD08_Get_Lexicon_Detail.puml**: Detailed lexicon view with assets/references
- **SD09_Get_Media_File.puml**: Media file access for published assets
- **SD10_Get_About_Page_Data.puml**: About page data retrieval

**Note**: All diagrams use consistent architecture (Frontend → Auth Middleware → Controller → Service → Prisma → Database) and match actual API endpoints and business logic.

## �📈 Statistics & Analytics

Sistem menyediakan:
- Content statistics (jumlah leksikon, subkultur, budaya)
- Usage tracking untuk assets dan references
- Reference usage statistics across lexicons, subcultures, and cultures
- Geographic distribution data dengan koordinat latitude/longitude
- Conservation status tracking
- About references display order management

## 🔒 Security Features

- Password hashing dengan bcrypt
- JWT token authentication
- Role-based access control
- File upload validation
- SQL injection protection (Prisma ORM)
- CORS configuration

## 📚 Documentation

### API Documentation Files
- **Admin API Documentation**:
  - `CONTRIBUTOR_API_DOCUMENTATION.md` - Contributor management endpoints
  - `SUBCULTURE_API_DOCUMENTATION.md` - Subculture management endpoints
  - `CULTURE_API_DOCUMENTATION.md` - Culture management endpoints
  - `DOMAIN_KODIFIKASI_API_DOCUMENTATION.md` - Domain kodifikasi management endpoints
  - `REFERENCE_API_DOCUMENTATION.md` - Reference management endpoints
  - `LEKSIKON_API_DOCUMENTATION.md` - Lexicon management endpoints
  - `ADMIN_API_DOCUMENTATION.md` - Admin authentication and user management endpoints

- **Public API Documentation**:
  - `PUBLIC_API_ENDPOINTS_DOCUMENTATION.md` - Complete public API endpoints documentation
  - `ASSETS_API_ENDPOINTS_DOCUMENTATION.md` - Asset management endpoints with recent updates

### Development Documentation
- `README_SKRIPSI.md` - Comprehensive documentation for thesis/research usage
- `REFERENCE_ASSIGNMENT_GUIDE.md` - Guide for reference assignment processes
- `DATABASE_RELATIONSHIPS_README.md` - Database schema and relationships overview
- `IMPORT_SUMMARY.md` - Data import processes and summaries

### Recent Updates (December 2025)
- ✅ **Complete Project Verification**: All components verified and ready for thesis (December 22, 2025)
- ✅ **Sequence Diagram Alignment**: SD01-SD10 fully synchronized with use case specifications
- ✅ **Use Case Mapping Verification**: UC-SD mapping confirmed 100% accurate
- ✅ **Documentation Finalization**: All README and API docs updated with verification status
- ✅ Enhanced asset filter endpoint with combined search and filter capabilities
- ✅ Complete API documentation for all admin and public endpoints
- ✅ Improved search functionality with status-based filtering
- ✅ Comprehensive frontend integration notes in public API documentation
- ✅ Geographic coordinate support (latitude/longitude) for cultures

## 🛠️ Development

```bash
# Development dengan hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Format code
npx prettier --write .

# Lint code
npm run lint

# Test API endpoints
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Development Scripts
- `npm run dev` - Development server dengan hot reload
- `npm run build` - Production build dengan TypeScript compilation
- `npm run lint` - ESLint code quality checks
- `npm test` - API endpoint testing
- `npm start` - Production server

## 👤 Author

**Nanda Ha**
- **GitHub**: [@nandaha29](https://github.com/nandaha29)
- **Repository**: [be-corpora](https://github.com/nandaha29/be-corpora)
- **Project**: Leksikon Backend API for Cultural Lexicon Management System

## 📄 License

ISC

---

## 📋 Changelog

### Version 1.0.2 (December 22, 2025) - FINAL VERIFICATION COMPLETE
- ✅ **Complete Project Verification**: All API endpoints, database relations, and documentation verified against actual implementation
- ✅ **Sequence Diagram Alignment**: SD01-SD10 diagrams fully synchronized with use case specifications and code implementation
- ✅ **Use Case Mapping Verification**: UC-SD mapping confirmed 100% accurate with project functionality
- ✅ **Documentation Finalization**: All README files updated with current project status and verification notes
- ✅ **Thesis Readiness Confirmation**: Project structure and documentation ready for academic submission
- ✅ **Code-Implementation Sync**: All diagrams and documentation reflect actual working code

### Version 1.0.1 (December 11, 2025)
- ✅ **Reference Management Endpoints**: Added comprehensive about-references and reference-junctions APIs for managing reference assignments and about page references
- ✅ **Data Import Completion**: Successfully imported lexicon (131 records), contributor (17 records), and codification domain (13 records) data from JSON exports
- ✅ **Reference Assignment Features**: Implemented junction tables for linking references to lexicons, subcultures, and cultures with role-based assignments
- ✅ **API Documentation Updates**: Updated README with latest endpoint details, usage examples, and request/response formats
- ✅ **Reference Usage Tracking**: Added statistics endpoints to track reference usage across different content entities
- ✅ **About References Management**: Implemented CRUD operations for references displayed on about page with display order reordering

### Version 1.0.0 (December 2025)
- ✅ **Complete API Documentation**: Comprehensive documentation for all admin and public endpoints
- ✅ **Enhanced Asset Filtering**: Combined search and filter capabilities in asset endpoints
- ✅ **Improved Search Functionality**: Status-based filtering and advanced search features
- ✅ **Public API Integration**: Detailed documentation with frontend usage notes
- ✅ **Database Optimization**: Improved query performance and data relationships
- ✅ **Security Enhancements**: JWT authentication and role-based access control
- ✅ **File Management**: Vercel Blob Storage integration for media assets
- ✅ **Bulk Import Features**: CSV import with error handling and validation
- ✅ **Usage Tracking**: Asset and reference usage monitoring
- ✅ **Geographic Features**: Latitude/longitude coordinate support for cultures

