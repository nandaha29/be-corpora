# PUBLIC API ENDPOINTS DOCUMENTATION

## Overview
This document provides comprehensive documentation for all public API endpoints in the Leksikon Cultural Management System. These endpoints are accessible without authentication and provide read-only access to published cultural content.

## Base URL
- Public endpoints: `/api/v1/public/`
- Some legacy endpoints: `/api/v1/search/`

## Authentication
All public endpoints require **NO authentication** - they are accessible to anyone.

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

## 1. SEARCH ENDPOINTS (`/api/v1/public/search/`)

### 1.1 Global Search Formatted
- **Method**: `GET`
- **Path**: `/api/public/search/global`
- **Auth**: None
- **Query**: `query` (required), `category` (optional)
- **Description**: Global search formatted for frontend consumption, returns categorized results with highlights
- **Categories**: subculture, lexicon, all
- **Response**:
```json
{
  "success": true,
  "message": "Global search completed",
  "data": {
    "subcultures": [...],
    "lexicons": [...],
    "highlights": [...]
  }
}
```
- **Usage**: Used by frontend in global-search-container.tsx and page.tsx

### 1.2 Global Search
- **Method**: `GET`
- **Path**: `/api/public/search`
- **Auth**: None
- **Query**: `query` (required), `filters` (optional)
- **Description**: Comprehensive search across all content types (cultures, subcultures, lexicons, etc.)
- **Usage**: Not used by frontend

### 1.3 Search Lexicon
- **Method**: `GET`
- **Path**: `/api/public/search/lexicon`
- **Auth**: None
- **Query**: `query` (required), `fields` (optional), `limit` (default: 20)
- **Description**: Search specifically in lexicons with relevance scoring
- **Usage**: Not used by frontend

### 1.4 Advanced Search
- **Method**: `GET`
- **Path**: `/api/public/search/advanced`
- **Auth**: None
- **Query**: `query`, `culture`, `subculture`, `domain`, `region`, `status`, `page`, `limit`
- **Description**: Advanced search with multiple parameters and filters
- **Response**: Advanced search results with applied filters and pagination
- **Usage**: Used by frontend in page.tsx for advanced search

### 1.5 Search References
- **Method**: `GET`
- **Path**: `/api/v1/search/references`
- **Auth**: None
- **Query**: `q` (required), `page` (default: 1), `limit` (default: 20)
- **Description**: Search published references by title, author, description, or type
- **Response**: Search results with pagination metadata
- **Usage**: Used by frontend in page.tsx for reference search

### 1.6 Search Coordinators
- **Method**: `GET`
- **Path**: `/api/v1/search/coordinator`
- **Auth**: None
- **Query**: `q` (required), `page` (default: 1), `limit` (default: 20)
- **Description**: Search published contributors (active coordinators) by name, institution, or expertise
- **Response**: Search results with pagination metadata
- **Usage**: Used by frontend in page.tsx for contributor search

### 1.7 Search Cultures
- **Method**: `GET`
- **Path**: `/api/v1/search/culture`
- **Auth**: None
- **Query**: `q` (required), `page` (default: 1), `limit` (default: 10)
- **Description**: Search published cultures by name, island, province, city, classification, or characteristics
- **Response**: Search results with pagination metadata
- **Usage**: Not used by frontend

---

## 2. LEXICON ENDPOINTS (`/api/v1/public/lexicons/`)

### 2.1 Get All Lexicons
- **Method**: `GET`
- **Path**: `/api/public/lexicons`
- **Auth**: None
- **Query**: `regionFilter`, `searchQuery`, `page` (default: 1), `limit` (default: 10)
- **Description**: Get all published lexicons with filtering and search capabilities
- **Region Filters**: all, pulau1, pulau2, etc.
- **Response**: List of lexicons with pagination metadata
- **Usage**: Not used by frontend for unfiltered lists

### 2.2 Get Lexicon Detail
- **Method**: `GET`
- **Path**: `/api/public/lexicons/:identifier`
- **Auth**: None
- **Params**: `identifier` (term slug or ID)
- **Description**: Get detailed information about a specific lexicon
- **Response**: Complete lexicon details including assets, references, and related data
- **Usage**: Used by frontend for lexicon details

---

## 3. CULTURE ENDPOINTS (`/api/v1/public/cultures/`)

### 3.1 Get All Cultures
- **Method**: `GET`
- **Path**: `/api/public/cultures`
- **Auth**: None
- **Query**: `page` (default: 1), `limit` (default: 20)
- **Description**: Get all published cultures with pagination
- **Response**: List of published cultures with pagination metadata
- **Usage**: Not used by frontend

### 3.2 Get Culture Detail
- **Method**: `GET`
- **Path**: `/api/public/cultures/:culture_id`
- **Auth**: None
- **Params**: `culture_id` (Culture ID)
- **Description**: Get detailed information about a specific culture
- **Response**: Culture details including subcultures, domains, and lexicons
- **Usage**: Not used by frontend

### 3.3 Search Leksikons in Culture
- **Method**: `GET`
- **Path**: `/api/public/cultures/:culture_id/search`
- **Auth**: None
- **Params**: `culture_id` (Culture ID)
- **Query**: `query`, `page` (default: 1), `limit` (default: 10)
- **Description**: Search for lexicons within a specific culture hierarchy
- **Response**: Search results with lexicons from the culture
- **Usage**: Not used by frontend

---

## 4. ASSET ENDPOINTS (`/api/v1/public/assets/`)

### 4.1 Get Public Asset File
- **Method**: `GET`
- **Path**: `/api/public/assets/:id/file`
- **Auth**: None
- **Params**: `id` (Asset ID)
- **Description**: Get public asset file (only if status = 'PUBLISHED')
- **Response**: Asset file data
- **Usage**: Status unknown - not mentioned in frontend usage

---

## 5. CONTRIBUTOR ENDPOINTS (`/api/v1/public/contributors/`)

### 5.1 Search Published Contributors
- **Method**: `GET`
- **Path**: `/api/v1/search/coordinator`
- **Auth**: None
- **Query**: `q` (required), `page` (default: 1), `limit` (default: 20)
- **Description**: Search published contributors (active coordinators) by name, institution, or expertise
- **Response**: Search results with pagination metadata
- **Usage**: Used by frontend in page.tsx for contributor search

---

## 6. REFERENCE ENDPOINTS (`/api/v1/search/references`)

### 6.1 Search Published References
- **Method**: `GET`
- **Path**: `/api/v1/search/references`
- **Auth**: None
- **Query**: `q` (required), `page` (default: 1), `limit` (default: 20)
- **Description**: Search published references by title, author, description, or type
- **Response**: Search results with pagination metadata
- **Usage**: Used by frontend in page.tsx for reference search

---

## 7. LANDING PAGE ENDPOINTS (`/api/v1/public/landing/`)

### 7.1 Get Landing Page Data
- **Method**: `GET`
- **Path**: `/api/public/landing`
- **Auth**: None
- **Description**: Get data for landing page display
- **Response**: Landing page content and statistics
- **Usage**: Used by frontend for landing page

---

## 8. DOMAIN ENDPOINTS (`/api/v1/public/domains/`)

### 8.1 Get All Domains
- **Method**: `GET`
- **Path**: `/api/public/domains`
- **Auth**: None
- **Query**: `page`, `limit`
- **Description**: Get all published domains
- **Response**: List of domains with pagination
- **Usage**: Used by frontend for domain listings

### 8.2 Get Domain Detail
- **Method**: `GET`
- **Path**: `/api/public/domains/:id`
- **Auth**: None
- **Params**: `id` (Domain ID)
- **Description**: Get detailed information about a specific domain
- **Response**: Domain details with related lexicons
- **Usage**: Used by frontend for domain details

---

## 9. SUBCULTURE ENDPOINTS (`/api/v1/public/subcultures/`)

### 9.1 Get All Subcultures
- **Method**: `GET`
- **Path**: `/api/public/subcultures`
- **Auth**: None
- **Query**: `page`, `limit`
- **Description**: Get all published subcultures
- **Response**: List of subcultures with pagination
- **Usage**: Used by frontend for subculture listings

### 9.2 Get Subculture Detail
- **Method**: `GET`
- **Path**: `/api/public/subcultures/:id`
- **Auth**: None
- **Params**: `id` (Subculture ID)
- **Description**: Get detailed information about a specific subculture
- **Response**: Subculture details with related data
- **Usage**: Used by frontend for subculture details

---

## 10. REGION ENDPOINTS (`/api/v1/public/regions/`)

### 10.1 Get All Regions
- **Method**: `GET`
- **Path**: `/api/public/regions`
- **Auth**: None
- **Description**: Get all available regions
- **Response**: List of regions
- **Usage**: Used by frontend for region filters

---

## 11. ABOUT ENDPOINTS (`/api/v1/public/about/`)

### 11.1 Get About Data
- **Method**: `GET`
- **Path**: `/api/public/about`
- **Auth**: None
- **Description**: Get about page content
- **Response**: About page information
- **Usage**: Used by frontend for about page

---

## Usage Examples

### Global Search
```bash
# Global search formatted
curl "http://localhost:3000/api/v1/public/search/global?query=batik&category=all"

# Advanced search
curl "http://localhost:3000/api/v1/public/search/advanced?query=batik&culture=javanese&page=1&limit=10"
```

### Lexicon Operations
```bash
# Get all lexicons with search
curl "http://localhost:3000/api/v1/public/lexicons?regionFilter=all&searchQuery=batik&page=1&limit=10"

# Get lexicon detail
curl "http://localhost:3000/api/v1/public/lexicons/batik"
```

### Culture Operations
```bash
# Get all cultures
curl "http://localhost:3000/api/v1/public/cultures?page=1&limit=20"

# Search lexicons in culture
curl "http://localhost:3000/api/v1/public/cultures/1/search?query=batik&page=1&limit=10"
```

### Reference Search
```bash
# Search references
curl "http://localhost:3000/api/v1/search/references?q=linguistics&page=1&limit=20"
```

### Contributor Search
```bash
# Search coordinators
curl "http://localhost:3000/api/v1/search/coordinator?q=university&page=1&limit=20"
```

---

## Response Format Standards

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "total": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Single Item Response
```json
{
  "success": true,
  "message": "Item retrieved successfully",
  "data": {
    // item details
  }
}
```

### Search Response
```json
{
  "success": true,
  "message": "Search completed",
  "data": [...],
  "meta": {
    "query": "search term",
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
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

## Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## 6. DOMAIN ENDPOINTS (`/api/v1/public/domains/`)

### 6.1 Get Domain Detail
- **Method**: `GET`
- **Path**: `/api/public/domains/:domain_id`
- **Auth**: None
- **Params**: `domain_id` (number, required)
- **Description**: Get detailed information about a specific domain including related subculture and lexicons
- **Response**:
```json
{
  "success": true,
  "message": "Domain details retrieved successfully",
  "data": {
    "id": 1,
    "name": "Domain Name",
    "description": "Domain description",
    "subculture": {...},
    "lexicons": [...]
  }
}
```
- **Usage**: Not used by frontend

### 6.2 Search Lexicons in Domain
- **Method**: `GET`
- **Path**: `/api/public/domains/:domain_id/search`
- **Auth**: None
- **Params**: `domain_id` (number, required)
- **Query**: `query` (string, required)
- **Description**: Search for lexicons within a specific domain
- **Response**:
```json
{
  "success": true,
  "message": "Domain search completed",
  "data": {
    "lexicons": [...],
    "total": 25
  }
}
```
- **Usage**: Not used by frontend

## 7. REGION ENDPOINTS (`/api/v1/public/regions/`)

### 7.1 Get Region Data
- **Method**: `GET`
- **Path**: `/api/public/regions/:regionId`
- **Auth**: None
- **Params**: `regionId` (string, required)
- **Description**: Get region data for map popup display including culture statistics, subcultures, and lexicons
- **Response**:
```json
{
  "success": true,
  "message": "Region data retrieved successfully",
  "data": {
    "regionId": "province_name",
    "cultureStats": {...},
    "subcultures": [...],
    "lexicons": [...]
  }
}
```
- **Usage**: Used by frontend for map popup data

## 8. CONTRIBUTOR ENDPOINTS (`/api/v1/public/contributors/`)

### 8.1 Get Published Contributors
- **Method**: `GET`
- **Path**: `/api/public/contributors`
- **Auth**: None
- **Query**: `page` (number, optional, default: 1), `limit` (number, optional, default: 20)
- **Description**: Get all published contributors (active coordinators) with pagination
- **Response**:
```json
{
  "success": true,
  "message": "Contributors retrieved successfully",
  "data": [...],
  "total": 150,
  "pagination": {...}
}
```
- **Usage**: Used by frontend for contributor listings with pagination

### 8.2 Get Published Contributor Detail
- **Method**: `GET`
- **Path**: `/api/public/contributors/:contributor_id`
- **Auth**: None
- **Params**: `contributor_id` (number, required)
- **Description**: Get detailed information about a specific published contributor including assets
- **Response**:
```json
{
  "success": true,
  "message": "Contributor details retrieved successfully",
  "data": {
    "id": 1,
    "name": "Contributor Name",
    "assets": [...]
  }
}
```
- **Usage**: Not used by frontend

## 9. SUBCULTURE ENDPOINTS (`/api/v1/public/subcultures/`)

### 9.1 Get Subcultures Gallery
- **Method**: `GET`
- **Path**: `/api/public/subcultures`
- **Auth**: None
- **Query**: `searchQuery` (string, optional), `category` (string, optional), `page` (number, optional, default: 1), `limit` (number, optional, default: 10)
- **Description**: Get all subcultures for gallery display with optional search and filtering
- **Response**:
```json
{
  "success": true,
  "message": "Subcultures gallery retrieved successfully",
  "data": [...],
  "total": 75,
  "pagination": {...}
}
```
- **Usage**: Used by frontend in page.tsx for subculture gallery

### 9.2 Get Subculture Detail
- **Method**: `GET`
- **Path**: `/api/public/subcultures/:identifier`
- **Auth**: None
- **Params**: `identifier` (string, required - slug or ID)
- **Query**: `searchQuery` (string, optional)
- **Description**: Get detailed information about a specific subculture including domains, lexicons, and assets
- **Response**:
```json
{
  "success": true,
  "message": "Subculture details retrieved successfully",
  "data": {
    "id": 1,
    "name": "Subculture Name",
    "domains": [...],
    "lexicons": [...],
    "assets": [...]
  }
}
```
- **Usage**: Used by frontend in page.tsx for subculture details

## 10. LANDING PAGE ENDPOINTS (`/api/v1/public/landing-page/`)

### 10.1 Get Landing Page Data
- **Method**: `GET`
- **Path**: `/api/public/landing-page`
- **Auth**: None
- **Description**: Get landing page data including featured content, statistics, and highlights
- **Response**:
```json
{
  "success": true,
  "message": "Landing page data retrieved successfully",
  "data": {
    "cultures": [...],
    "subcultures": [...],
    "lexicons": [...],
    "statistics": {...}
  }
}
```
- **Usage**: Used by frontend (note: frontend calls `/api/v1/public/landing` - API version mismatch)

### 10.2 Submit Contact Form
- **Method**: `POST`
- **Path**: `/api/public/landing-page/contact`
- **Auth**: None
- **Body**: `name` (string, required), `email` (string, required), `subject` (string, required), `message` (string, required)
- **Description**: Submit contact form from landing page
- **Response**:
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```
- **Usage**: Not used by frontend (no contact form in frontend; route and controller commented out)

## 11. ABOUT PAGE ENDPOINTS (`/api/v1/public/about/`)

### 11.1 Get About Page Data
- **Method**: `GET`
- **Path**: `/api/public/about`
- **Auth**: None
- **Description**: Get about page data including stats, team, references, and project information
- **Response**:
```json
{
  "success": true,
  "message": "About page data retrieved successfully",
  "data": {
    "visiMisiSection": {...},
    "teamScientis": [...],
    "collaborationAssets": [...],
    "academicReferences": [...],
    "projectSteps": [...],
    "projectProcess": {...},
    "projectRoadmap": [...],
    "platformFeatures": [...],
    "youtubeVideos": [...],
    "galleryPhotos": [...]
  }
}
```
- **Usage**: Used by frontend for about page

## Frontend Usage Notes

### Used by Frontend
- `/api/public/search/global` - global-search-container.tsx, page.tsx
- `/api/public/search/advanced` - page.tsx
- `/api/public/lexicons/:identifier` - lexicon details
- `/api/v1/search/references` - page.tsx
- `/api/v1/search/coordinator` - page.tsx
- `/api/public/landing-page` - landing page data (note: frontend calls `/api/v1/public/landing`)
- `/api/public/about` - about page
- `/api/public/domains` - domain listings
- `/api/public/domains/:id` - domain details
- `/api/public/subcultures` - subculture listings (page.tsx)
- `/api/public/subcultures/:id` - subculture details (page.tsx)
- `/api/public/regions/:regionId` - region data for map popup
- `/api/public/contributors` - contributor listings with pagination

### Not Used by Frontend
- `/api/public/search` - general global search
- `/api/public/search/lexicon` - specific lexicon search
- `/api/public/cultures` - culture listings
- `/api/public/cultures/:culture_id` - culture details
- `/api/public/cultures/:culture_id/search` - culture-specific search
- `/api/public/lexicons` - all lexicons listing
- `/api/v1/search/culture` - culture search
- `/api/public/assets/:id/file` - public asset access
- `/api/public/domains/:domain_id/search` - domain-specific lexicon search
- `/api/public/contributors/:contributor_id` - individual contributor details
- `/api/public/landing-page/contact` - contact form submission (no contact form in frontend)

## Notes
- All public endpoints are accessible without authentication
- All data returned is published/approved content only
- Search endpoints support partial matching and case-insensitive queries
- Pagination is available on list endpoints
- Response formats are consistent across all endpoints
- Some endpoints are marked as "not used" based on current frontend implementation