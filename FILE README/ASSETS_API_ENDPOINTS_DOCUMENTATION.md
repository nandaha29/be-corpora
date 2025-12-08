# API Endpoint Documentation - Leksikon Cultural Management System

## Overview
This document provides comprehensive documentation for all API endpoints in the Leksikon Cultural Management System. The API is organized into Admin endpoints (requiring authentication) and Public endpoints (accessible without authentication).

## Recent Updates (December 8, 2025)
- **Asset Filter Enhancement**: Added `search` parameter to `/api/admin/assets/filter` endpoint, allowing combination of fileType, status, and text search in fileName/description fields.

## Base URL
- Admin endpoints: `/api/v1/admin/`
- Public endpoints: `/api/v1/public/`

## Authentication
Admin endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Response Format
All endpoints return responses in the following format:
```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "total": number, // for paginated responses
  "pagination": object // pagination metadata
}
```

---

## 1. ADMIN AUTHENTICATION ENDPOINTS (`/api/v1/admin/auth/`)

### 1.1 Register Admin
- **Method**: `POST`
- **Path**: `/api/admin/register`
- **Auth**: None (Public)
- **Body**:
  ```json
  {
    "username": "string (3-50 chars)",
    "email": "string (valid email)",
    "password": "string (min 8 chars)",
    "role": "string (optional, defaults to EDITOR)"
  }
  ```
- **Response**: Admin profile with JWT token

### 1.2 Admin Login
- **Method**: `POST`
- **Path**: `/api/admin/login`
- **Auth**: None (Public)
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token and admin profile

### 1.3 Get Profile
- **Method**: `GET`
- **Path**: `/api/admin/profile`
- **Auth**: Required
- **Response**: Current admin profile data

### 1.4 Change Password
- **Method**: `PUT`
- **Path**: `/api/admin/change-password`
- **Auth**: Required
- **Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string (min 8 chars)"
  }
  ```

### 1.5 Update Profile
- **Method**: `PUT`
- **Path**: `/api/admin/update-profile`
- **Auth**: Required
- **Body**:
  ```json
  {
    "username": "string (optional)",
    "email": "string (optional)",
    "role": "string (optional)",
    "isActive": "boolean (optional)"
  }
  ```

### 1.6 Update Admin Status
- **Method**: `PUT`
- **Path**: `/api/admin/admins/:id/status`
- **Auth**: Required
- **Params**: `id` (Admin ID)
- **Body**:
  ```json
  {
    "isActive": "boolean"
  }
  ```

---

## 2. ADMIN ASSET MANAGEMENT (`/api/v1/admin/assets/`)

### 2.1 Get All Assets (Paginated)
- **Method**: `GET`
- **Path**: `/api/admin/assets`
- **Auth**: Required
- **Query**: `page`, `limit`

### 2.2 Search Assets
- **Method**: `GET`
- **Path**: `/api/admin/assets/search`
- **Auth**: Required
- **Query**: `q` (required), `page`, `limit`

### 2.3 Filter Assets
- **Method**: `GET`
- **Path**: `/api/admin/assets/filter`
- **Auth**: Required
- **Query**: `fileType`, `status`, `search`, `sortBy`, `order`, `page`, `limit`
- **Description**: Filter assets by type and/or status with optional search in fileName and description. Supports combining multiple filters with search.

### 2.4 Get Asset by ID
- **Method**: `GET`
- **Path**: `/api/admin/assets/:id`
- **Auth**: Required
- **Params**: `id` (Asset ID)

### 2.5 Upload Single Asset
- **Method**: `POST`
- **Path**: `/api/admin/assets/upload`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (asset file), plus metadata fields

### 2.6 Update Asset
- **Method**: `PUT`
- **Path**: `/api/admin/assets/:id`
- **Auth**: Required
- **Params**: `id` (Asset ID)
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (optional), plus metadata fields

### 2.7 Delete Asset
- **Method**: `DELETE`
- **Path**: `/api/admin/assets/:id`
- **Auth**: Required
- **Params**: `id` (Asset ID)

### 2.8 Bulk Upload Assets
- **Method**: `POST`
- **Path**: `/api/admin/assets/bulk-upload`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**: `files` (array), `assets` (metadata array)

---

## 3. ADMIN CONTRIBUTOR MANAGEMENT (`/api/v1/admin/contributors/`)

### 3.1 Search Contributors
- **Method**: `GET`
- **Path**: `/api/admin/contributors/search`
- **Auth**: Required
- **Query**: `q`, `page`, `limit`

### 3.2 Search Coordinators
- **Method**: `GET`
- **Path**: `/api/admin/contributors/coordinators/search`
- **Auth**: Required
- **Query**: `q` (required), `page`, `limit`

### 3.3 Filter Coordinators
- **Method**: `GET`
- **Path**: `/api/admin/contributors/coordinators/filter`
- **Auth**: Required
- **Query**: `coordinatorStatus`, `expertiseArea`, `institution`, `page`, `limit`

### 3.4 Get All Contributors (Paginated)
- **Method**: `GET`
- **Path**: `/api/admin/contributors`
- **Auth**: Required
- **Query**: `page`, `limit`

### 3.5 Get Contributor by ID
- **Method**: `GET`
- **Path**: `/api/admin/contributors/:id`
- **Auth**: Required
- **Params**: `id` (Contributor ID)

### 3.6 Create Contributor
- **Method**: `POST`
- **Path**: `/api/admin/contributors`
- **Auth**: Required
- **Body**:
  ```json
  {
    "contributorName": "string",
    "institution": "string",
    "email": "string",
    "expertiseArea": "string",
    "contactInfo": "string"
  }
  ```

### 3.7 Update Contributor
- **Method**: `PUT`
- **Path**: `/api/admin/contributors/:id`
- **Auth**: Required
- **Params**: `id` (Contributor ID)
- **Body**: Same as create

### 3.8 Delete Contributor
- **Method**: `DELETE`
- **Path**: `/api/admin/contributors/:id`
- **Auth**: Required
- **Params**: `id` (Contributor ID)

### 3.9 Get Contributor Assets
- **Method**: `GET`
- **Path**: `/api/admin/contributors/:id/assets`
- **Auth**: Required
- **Params**: `id` (Contributor ID)

### 3.10 Add Asset to Contributor
- **Method**: `POST`
- **Path**: `/api/admin/contributors/:id/assets`
- **Auth**: Required
- **Params**: `id` (Contributor ID)
- **Body**:
  ```json
  {
    "assetId": "number",
    "assetNote": "string (LOGO, FOTO_DIRI, SIGNATURE, CERTIFICATE)"
  }
  ```

### 3.11 Remove Asset from Contributor
- **Method**: `DELETE`
- **Path**: `/api/admin/contributors/:id/assets/:assetId`
- **Auth**: Required
- **Params**: `id` (Contributor ID), `assetId` (Asset ID)

---

## 4. ADMIN CULTURE MANAGEMENT (`/api/v1/admin/cultures/`)

### 4.1 Search Cultures
- **Method**: `GET`
- **Path**: `/api/admin/cultures/search`
- **Auth**: Required
- **Query**: `q`, `page`, `limit`

### 4.2 Filter Cultures
- **Method**: `GET`
- **Path**: `/api/admin/cultures/filter`
- **Auth**: Required
- **Query**: `conservationStatus`, `status`, `originIsland`, `province`, `cityRegion`, `page`, `limit`

### 4.3 Get All Cultures (Paginated)
- **Method**: `GET`
- **Path**: `/api/admin/cultures`
- **Auth**: Required
- **Query**: `page`, `limit`

### 4.4 Create Culture
- **Method**: `POST`
- **Path**: `/api/admin/cultures`
- **Auth**: Required
- **Body**:
  ```json
  {
    "cultureName": "string",
    "originIsland": "string",
    "province": "string",
    "cityRegion": "string",
    "classification": "string (optional)",
    "characteristics": "string (optional)",
    "conservationStatus": "MAINTAINED|TREATED|CRITICAL|ARCHIVED",
    "latitude": "number (optional)",
    "longitude": "number (optional)",
    "status": "DRAFT|PUBLISHED|ARCHIVED"
  }
  ```

### 4.5 Get Culture by ID
- **Method**: `GET`
- **Path**: `/api/admin/cultures/:id`
- **Auth**: Required
- **Params**: `id` (Culture ID)

### 4.6 Update Culture
- **Method**: `PUT`
- **Path**: `/api/admin/cultures/:id`
- **Auth**: Required
- **Params**: `id` (Culture ID)
- **Body**: Same as create

### 4.7 Delete Culture
- **Method**: `DELETE`
- **Path**: `/api/admin/cultures/:id`
- **Auth**: Required
- **Params**: `id` (Culture ID)

### 4.8 Get Culture with Assets
- **Method**: `GET`
- **Path**: `/api/admin/cultures/cultures/:cultureId`
- **Auth**: Required
- **Params**: `cultureId` (Culture ID)

### 4.9 Add Reference to Culture
- **Method**: `POST`
- **Path**: `/api/admin/cultures/:id/references`
- **Auth**: Required
- **Params**: `id` (Culture ID)
- **Body**:
  ```json
  {
    "referenceId": "number",
    "citationNote": "string (optional)",
    "displayOrder": "number (optional, default: 0)"
  }
  ```

### 4.10 Get Culture References
- **Method**: `GET`
- **Path**: `/api/admin/cultures/:id/references`
- **Auth**: Required
- **Params**: `id` (Culture ID)

### 4.11 Remove Reference from Culture
- **Method**: `DELETE`
- **Path**: `/api/admin/cultures/:id/references/:referenceId`
- **Auth**: Required
- **Params**: `id` (Culture ID), `referenceId` (Reference ID)

---

## 5. ADMIN DOMAIN KODIFIKASI MANAGEMENT (`/api/v1/admin/domain-kodifikasi/`)

### 5.1 Get All Domains (Paginated)
- **Method**: `GET`
- **Path**: `/api/admin/domain-kodifikasi`
- **Auth**: Required
- **Query**: `page`, `limit`

### 5.2 Create Domain
- **Method**: `POST`
- **Path**: `/api/admin/domain-kodifikasi`
- **Auth**: Required
- **Body**:
  ```json
  {
    "code": "string",
    "domainName": "string",
    "explanation": "string",
    "subcultureId": "number",
    "status": "DRAFT|PUBLISHED|ARCHIVED"
  }
  ```

### 5.3 Filter Domains
- **Method**: `GET`
- **Path**: `/api/admin/domain-kodifikasi/filter`
- **Auth**: Required
- **Query**: `code`, `status`, `page`, `limit`

### 5.4 Search Domains
- **Method**: `GET`
- **Path**: `/api/admin/domain-kodifikasi/search`
- **Auth**: Required
- **Query**: `q` (required), `page`, `limit`

### 5.5 Get Domain by ID
- **Method**: `GET`
- **Path**: `/api/admin/domain-kodifikasi/:id`
- **Auth**: Required
- **Params**: `id` (Domain ID)

### 5.6 Update Domain
- **Method**: `PUT`
- **Path**: `/api/admin/domain-kodifikasi/:id`
- **Auth**: Required
- **Params**: `id` (Domain ID)
- **Body**: Same as create

### 5.7 Delete Domain
- **Method**: `DELETE`
- **Path**: `/api/admin/domain-kodifikasi/:id`
- **Auth**: Required
- **Params**: `id` (Domain ID)

---

## 6. ADMIN LEKSIKON MANAGEMENT (`/api/v1/admin/leksikons/`)

### 6.1 Get Leksikons by Status
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/status`
- **Auth**: Required
- **Query**: `status`

### 6.2 Get Leksikons by Domain
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/domain-kodifikasi/:dk_id/leksikons`
- **Auth**: Required
- **Params**: `dk_id` (Domain Kodifikasi ID)

### 6.3 Search Assets in Leksikons
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/search/assets`
- **Auth**: Required
- **Query**: `q`, `page`, `limit`

### 6.4 Search References in Leksikons
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/search/references`
- **Auth**: Required
- **Query**: `q`, `page`, `limit`

### 6.5 Filter Leksikon Assets
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/filter/assets`
- **Auth**: Required
- **Query**: `fileType`, `status`, `createdAt`, `page`, `limit`

### 6.6 Filter Leksikon References
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/filter/references`
- **Auth**: Required
- **Query**: `referenceType`, `publicationYear`, `status`, `page`, `limit`

### 6.7 Get Assigned Assets
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/assets/assigned`
- **Auth**: Required
- **Query**: `page`, `limit`

### 6.8 Get Asset Usage
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/assets/:assetId/usages`
- **Auth**: Required
- **Params**: `assetId` (Asset ID)

### 6.9 Get Assigned References
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/references/assigned`
- **Auth**: Required
- **Query**: `page`, `limit`

### 6.10 Get Reference Usage
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/references/:referenceId/usages`
- **Auth**: Required
- **Params**: `referenceId` (Reference ID)

### 6.11 Bulk Import Leksikons
- **Method**: `POST`
- **Path**: `/api/admin/leksikons/import`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (CSV file)

### 6.12 Get All Leksikons (Paginated)
- **Method**: `GET`
- **Path**: `/api/admin/leksikons`
- **Auth**: Required
- **Query**: `page`, `limit`

### 6.13 Get Leksikon by ID
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/:id`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)

### 6.14 Create Leksikon
- **Method**: `POST`
- **Path**: `/api/admin/leksikons`
- **Auth**: Required
- **Body**: Leksikon data object

### 6.15 Update Leksikon
- **Method**: `PUT`
- **Path**: `/api/admin/leksikons/:id`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)
- **Body**: Leksikon data object

### 6.16 Delete Leksikon
- **Method**: `DELETE`
- **Path**: `/api/admin/leksikons/:id`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)

### 6.17 Update Leksikon Status
- **Method**: `PATCH`
- **Path**: `/api/admin/leksikons/:id/status`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)
- **Body**:
  ```json
  {
    "status": "DRAFT|PUBLISHED|ARCHIVED"
  }
  ```

### 6.18 Get Leksikon Assets
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/:id/assets`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)

### 6.19 Add Asset to Leksikon
- **Method**: `POST`
- **Path**: `/api/admin/leksikons/:id/assets`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)
- **Body**: Asset assignment data

### 6.20 Update Asset Role
- **Method**: `PUT`
- **Path**: `/api/admin/leksikons/:id/assets/:assetId/role`
- **Auth**: Required
- **Params**: `id` (Leksikon ID), `assetId` (Asset ID)

### 6.21 Get Assets by Role
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/:id/assets/role/:assetRole`
- **Auth**: Required
- **Params**: `id` (Leksikon ID), `assetRole`

### 6.22 Remove Asset from Leksikon
- **Method**: `DELETE`
- **Path**: `/api/admin/leksikons/:id/assets/:assetId`
- **Auth**: Required
- **Params**: `id` (Leksikon ID), `assetId` (Asset ID)

### 6.23 Get Leksikon References
- **Method**: `GET`
- **Path**: `/api/admin/leksikons/:id/references`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)

### 6.24 Add Reference to Leksikon
- **Method**: `POST`
- **Path**: `/api/admin/leksikons/:id/references`
- **Auth**: Required
- **Params**: `id` (Leksikon ID)
- **Body**: Reference assignment data

### 6.25 Update Reference Role
- **Method**: `PUT`
- **Path**: `/api/admin/leksikons/:id/references/:referenceId`
- **Auth**: Required
- **Params**: `id` (Leksikon ID), `referenceId` (Reference ID)

### 6.26 Remove Reference from Leksikon
- **Method**: `DELETE`
- **Path**: `/api/admin/leksikons/:id/references/:referenceId`
- **Auth**: Required
- **Params**: `id` (Leksikon ID), `referenceId` (Reference ID)

---

## 7. ADMIN REFERENCE MANAGEMENT (`/api/v1/admin/references/`)

### 7.1 Get All References (Paginated)
- **Method**: `GET`
- **Path**: `/api/v1/admin/references`
- **Auth**: Required
- **Query**: `page`, `limit`

### 7.2 Search References
- **Method**: `GET`
- **Path**: `/api/v1/admin/references/search`
- **Auth**: Required
- **Query**: `q` (required), `page`, `limit`

### 7.3 Filter References
- **Method**: `GET`
- **Path**: `/api/v1/admin/references/filter`
- **Auth**: Required
- **Query**: `referenceType`, `publicationYear`, `status`, `createdAtFrom`, `createdAtTo`, `page`, `limit`

### 7.4 Get Reference by ID
- **Method**: `GET`
- **Path**: `/api/v1/admin/references/:id`
- **Auth**: Required
- **Params**: `id` (Reference ID)

### 7.5 Create Reference
- **Method**: `POST`
- **Path**: `/api/v1/admin/references`
- **Auth**: Required
- **Body**:
  ```json
  {
    "title": "string",
    "referenceType": "JOURNAL|BOOK|ARTICLE|WEBSITE|REPORT|THESIS|DISSERTATION|FIELD_NOTE",
    "description": "string",
    "url": "string (optional)",
    "authors": "string (optional)",
    "publicationYear": "string (optional)",
    "status": "DRAFT|PUBLISHED|ARCHIVED"
  }
  ```

### 7.6 Update Reference
- **Method**: `PUT`
- **Path**: `/api/v1/admin/references/:id`
- **Auth**: Required
- **Params**: `id` (Reference ID)
- **Body**: Same as create

### 7.7 Delete Reference
- **Method**: `DELETE`
- **Path**: `/api/v1/admin/references/:id`
- **Auth**: Required
- **Params**: `id` (Reference ID)

---

## 8. ADMIN SUBCULTURE MANAGEMENT (`/api/v1/admin/subcultures/`)

### 8.1 Get All Subcultures (Paginated)
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures`
- **Auth**: Required
- **Query**: `page`, `limit`

### 8.2 Create Subculture
- **Method**: `POST`
- **Path**: `/api/v1/admin/subcultures`
- **Auth**: Required
- **Body**:
  ```json
  {
    "subcultureName": "string",
    "traditionalGreeting": "string",
    "greetingMeaning": "string",
    "explanation": "string",
    "cultureId": "number",
    "status": "DRAFT|PUBLISHED|ARCHIVED",
    "conservationStatus": "MAINTAINED|TREATED|CRITICAL|ARCHIVED",
    "displayPriorityStatus": "HIGH|MEDIUM|LOW"
  }
  ```

### 8.3 Get Filtered Subcultures
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/filter`
- **Auth**: Required
- **Query**: `status`, `displayPriorityStatus`, `conservationStatus`, `cultureId`, `search`, `page`, `limit`

### 8.4 Get Subculture by ID
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id`
- **Auth**: Required
- **Params**: `id` (Subculture ID)

### 8.5 Update Subculture
- **Method**: `PUT`
- **Path**: `/api/v1/admin/subcultures/:id`
- **Auth**: Required
- **Params**: `id` (Subculture ID)
- **Body**: Same as create

### 8.6 Delete Subculture
- **Method**: `DELETE`
- **Path**: `/api/v1/admin/subcultures/:id`
- **Auth**: Required
- **Params**: `id` (Subculture ID)

### 8.7 Get Assigned Assets
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/assigned-assets`
- **Auth**: Required
- **Params**: `id` (Subculture ID)

### 8.8 Get Assigned References
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/assigned-references`
- **Auth**: Required
- **Params**: `id` (Subculture ID)

### 8.9 Add Reference Direct
- **Method**: `POST`
- **Path**: `/api/v1/admin/subcultures/:id/references-direct`
- **Auth**: Required
- **Params**: `id` (Subculture ID)
- **Body**:
  ```json
  {
    "referenceId": "number",
    "displayOrder": "number (optional)",
    "referenceRole": "string (optional)"
  }
  ```

### 8.10 Get Subculture References Direct
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/references-direct`
- **Auth**: Required
- **Params**: `id` (Subculture ID)

### 8.11 Remove Reference Direct
- **Method**: `DELETE`
- **Path**: `/api/v1/admin/subcultures/:id/references-direct/:referenceId`
- **Auth**: Required
- **Params**: `id` (Subculture ID), `referenceId` (Reference ID)

### 8.12 Filter Subculture Assets
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/filter-assets`
- **Auth**: Required
- **Params**: `id` (Subculture ID)
- **Query**: `type`, `assetRole`, `status`, `page`, `limit`

### 8.13 Filter Subculture References
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/filter-references`
- **Auth**: Required
- **Params**: `id` (Subculture ID)
- **Query**: `referenceType`, `publicationYear`, `status`, `referenceRole`, `page`, `limit`

### 8.14 Search Assets in Subculture
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/search-assets`
- **Auth**: Required
- **Params**: `id` (Subculture ID)
- **Query**: `q`

### 8.15 Search References in Subculture
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/search-references`
- **Auth**: Required
- **Params**: `id` (Subculture ID)
- **Query**: `q`

### 8.16 Get Asset Usage
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/assets/:assetId/usage`
- **Auth**: Required
- **Params**: `assetId` (Asset ID)

### 8.17 Get Reference Usage
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/references/:referenceId/usage`
- **Auth**: Required
- **Params**: `referenceId` (Reference ID)

### 8.18 Get Subculture Assets (Legacy)
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:id/assets`
- **Auth**: Required
- **Params**: `id` (Subculture ID)

### 8.19 Add Asset to Subculture (Legacy)
- **Method**: `POST`
- **Path**: `/api/v1/admin/subcultures/:id/assets`
- **Auth**: Required
- **Params**: `id` (Subculture ID)
- **Body**: Asset assignment data

### 8.20 Remove Asset from Subculture (Legacy)
- **Method**: `DELETE`
- **Path**: `/api/v1/admin/subcultures/:id/assets/:assetId`
- **Auth**: Required
- **Params**: `id` (Subculture ID), `assetId` (Asset ID)

### 8.21 Get Subcultures by Culture
- **Method**: `GET`
- **Path**: `/api/v1/admin/subcultures/:cultureId/subcultures`
- **Auth**: Required
- **Params**: `cultureId` (Culture ID)

---

## 9. PUBLIC ENDPOINTS (`/api/v1/public/`)

### 9.1 Culture Endpoints

#### Get All Published Cultures
- **Method**: `GET`
- **Path**: `/api/public/cultures`
- **Auth**: None
- **Query**: `page`, `limit`
- **Note**: Not used by frontend

#### Get Culture Detail
- **Method**: `GET`
- **Path**: `/api/public/cultures/:culture_id`
- **Auth**: None
- **Params**: `culture_id` (Culture ID)
- **Note**: Not used by frontend

#### Search Leksikons in Culture
- **Method**: `GET`
- **Path**: `/api/public/cultures/:culture_id/search`
- **Auth**: None
- **Params**: `culture_id` (Culture ID)
- **Query**: `query`, `page`, `limit`
- **Note**: Not used by frontend

### 9.2 Lexicon Endpoints

#### Get All Lexicons
- **Method**: `GET`
- **Path**: `/api/public/lexicons`
- **Auth**: None
- **Query**: `regionFilter`, `searchQuery`, `page`, `limit`
- **Note**: Not used by frontend for unfiltered lists

#### Get Lexicon Detail
- **Method**: `GET`
- **Path**: `/api/public/lexicons/:identifier`
- **Auth**: None
- **Params**: `identifier` (term slug or ID)
- **Note**: Used by frontend for lexicon details

### 9.3 Search Endpoints

#### Global Search Formatted
- **Method**: `GET`
- **Path**: `/api/public/search/global`
- **Auth**: None
- **Query**: `query`, `category`
- **Note**: Used by frontend in global-search-container.tsx and page.tsx

#### Global Search
- **Method**: `GET`
- **Path**: `/api/public/search`
- **Auth**: None
- **Query**: `query`, `filters`
- **Note**: Not used by frontend

#### Search Lexicon
- **Method**: `GET`
- **Path**: `/api/public/search/lexicon`
- **Auth**: None
- **Query**: `query`, `fields`, `limit`
- **Note**: Not used by frontend

#### Advanced Search
- **Method**: `GET`
- **Path**: `/api/public/search/advanced`
- **Auth**: None
- **Query**: `query`, `culture`, `subculture`, `domain`, `region`, `status`, `page`, `limit`
- **Note**: Used by frontend in page.tsx for advanced search

#### Search References
- **Method**: `GET`
- **Path**: `/api/v1/search/references`
- **Auth**: None
- **Query**: `q` (required), `page`, `limit`
- **Note**: Used by frontend in page.tsx for reference search

#### Search Coordinators
- **Method**: `GET`
- **Path**: `/api/v1/search/coordinator`
- **Auth**: None
- **Query**: `q` (required), `page`, `limit`
- **Note**: Used by frontend in page.tsx for contributor search

#### Search Cultures
- **Method**: `GET`
- **Path**: `/api/v1/search/culture`
- **Auth**: None
- **Query**: `q` (required), `page`, `limit`
- **Note**: Not used by frontend

---

## Usage Examples

### Authentication
```bash
# Register admin
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "role": "ADMIN"
  }'

# Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Use token in subsequent requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/admin/cultures
```

### Asset Management
```bash
# Upload asset
curl -X POST http://localhost:3000/api/admin/assets/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@image.jpg" \
  -F "fileName=image.jpg" \
  -F "fileType=PHOTO" \
  -F "description=Sample image"

# Filter assets
curl "http://localhost:3000/api/admin/assets/filter?fileType=PHOTO&status=PUBLISHED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter assets with search
curl "http://localhost:3000/api/admin/assets/filter?fileType=PHOTO&status=ACTIVE&search=brawijaya&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Culture Management
```bash
# Create culture
curl -X POST http://localhost:3000/api/admin/cultures \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cultureName": "Javanese Culture",
    "originIsland": "Java",
    "province": "Central Java",
    "status": "DRAFT"
  }'

# Search cultures
curl "http://localhost:3000/api/admin/cultures/search?q=java&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Public Search
```bash
# Global search
curl "http://localhost:3000/api/public/search/global?query=batik&category=all"

# Advanced search
curl "http://localhost:3000/api/public/search/advanced?query=batik&culture=javanese&page=1&limit=10"

# Get lexicon detail
curl "http://localhost:3000/api/public/lexicons/batik"
```

---

## Error Responses
All endpoints return errors in the following format:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Pagination
Paginated responses include:
```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "total": 150,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Notes
- All admin endpoints require JWT authentication
- File uploads use `multipart/form-data`
- All responses follow consistent format
- Pagination is available on list endpoints
- Search endpoints support partial matching
- Filter endpoints support multiple criteria combination including search
- Asset filter endpoint now supports combining fileType, status, and search parameters</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\API_ENDPOINTS_DOCUMENTATION.md