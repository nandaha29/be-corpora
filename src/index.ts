/**
 * ===========================================
 * LEKSIKON BACKEND API - MAIN ENTRY POINT
 * ===========================================
 * 
 * File: src/index.ts
 * Framework: Express.js v5.1.0
 * Database: PostgreSQL (Neon) with Prisma ORM v6.16.2
 * Storage: Vercel Blob Storage
 * Deployment: Vercel
 * 
 * Base URL: https://be-corpora.vercel.app/api/v1
 * 
 * API Structure:
 * ├── /api/v1/admin/auth/*        - Authentication (public: login, register)
 * ├── /api/v1/admin/cultures/*    - Culture management (protected)
 * ├── /api/v1/admin/contributors/*- Contributor management (protected)
 * ├── /api/v1/admin/references/*  - Reference management (protected)
 * ├── /api/v1/admin/assets/*      - Asset management (protected)
 * ├── /api/v1/admin/subcultures/* - Subculture management (protected)
 * ├── /api/v1/admin/leksikons/*   - Lexicon management (protected)
 * ├── /api/v1/admin/domain-kodifikasi/* - Domain management (protected)
 * ├── /api/v1/admin/reference-junctions/* - Reference assignment (protected)
 * ├── /api/v1/admin/about-references/* - About page references (protected)
 * ├── /api/v1/public/*            - Public API endpoints
 * └── /api/v1/search/*            - Search endpoints
 * 
 * Authentication:
 * - JWT Bearer Token required for /admin/* routes (except auth)
 * - Token generated on login, verified via auth.middleware.ts
 * 
 * Total Endpoints: ~94 endpoints
 * See: FILE README/API_ENDPOINTS_COMPLETE.md for full documentation
 * 
 * @module index
 * @author Development Team
 * @since 2025-01-01
 */

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticateAdmin } from './middleware/auth.middleware.js';

// ===========================================
// ADMIN ROUTE IMPORTS
// Protected routes requiring JWT authentication
// ===========================================
import adminRoutes from './routes/admin/admin.routes.js';
import cultureRoutes from './routes/admin/culture.routes.js';
import contributorRoutes from './routes/admin/contributor.routes.js';
import referensiRoutes from './routes/admin/reference.routes.js';
import referenceJunctionRoutes from './routes/admin/reference-junction.routes.js';
import aboutReferenceRoutes from './routes/admin/about-reference.routes.js';
import assetRoutes from './routes/admin/asset.routes.js';
import subcultureRoutes from './routes/admin/subculture.routes.js';
import domainKodifikasiRoutes from './routes/admin/domainKodifikasi.routes.js';
import leksikonRoutes from './routes/admin/leksikon.routes.js';

// ===========================================
// PUBLIC ROUTE IMPORTS
// Open routes for frontend consumption
// ===========================================
import landingPageRoute from "./routes/public/landingPage.routes.js";
import subculturePublicRoutes from "./routes/public/subculture.routes.js";
import lexiconRoutes from "./routes/public/lexicon.routes.js";
import searchRoutes from "./routes/public/search.routes.js";
import domainRoutes from "./routes/public/domain.routes.js";
import culturePublicRoutes from "./routes/public/culture.routes.js";
import regionRoutes from "./routes/public/region.routes.js";
import referencePublicRoutes from "./routes/public/reference.routes.js";
import contributorPublicRoutes from "./routes/public/contributor.routes.js";
import assetPublicRoutes from "./routes/public/asset.routes.js";
import aboutRoutes from "./routes/public/about.routes.js";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

// ===========================================
// MIDDLEWARE CONFIGURATION
// ===========================================
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend access
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads (form data)

// ===========================================
// HEALTH CHECK ENDPOINT
// ===========================================
/**
 * @route GET /api
 * @desc Health check endpoint to verify API is running
 * @access Public
 */
app.get('/api', (req: Request, res: Response) => {
  res.send('Leksikon Backend API is running!');
});

// ===========================================
// ADMIN ROUTES - AUTHENTICATION (PUBLIC)
// ===========================================
/**
 * Authentication routes - no JWT required
 * - POST /api/v1/admin/auth/login - Admin login
 * - POST /api/v1/admin/auth/register - Admin registration
 */
app.use('/api/v1/admin/auth', adminRoutes);

// ===========================================
// ADMIN ROUTES - PROTECTED (JWT REQUIRED)
// ===========================================
/**
 * All routes below require valid JWT token in Authorization header
 * Format: Authorization: Bearer <token>
 */
app.use('/api/v1/admin/cultures', authenticateAdmin, cultureRoutes);
app.use('/api/v1/admin/contributors', authenticateAdmin, contributorRoutes);
app.use('/api/v1/admin/references', authenticateAdmin, referensiRoutes);
app.use('/api/v1/admin/reference-junctions', authenticateAdmin, referenceJunctionRoutes);
app.use('/api/v1/admin/about-references', authenticateAdmin, aboutReferenceRoutes);
app.use('/api/v1/admin/assets', authenticateAdmin, assetRoutes);
app.use("/api/v1/admin/subcultures", authenticateAdmin, subcultureRoutes);
app.use("/api/v1/admin/domain-kodifikasi", authenticateAdmin, domainKodifikasiRoutes);
app.use('/api/v1/admin/leksikons', authenticateAdmin, leksikonRoutes);

// ===========================================
// PUBLIC ROUTES - NO AUTHENTICATION REQUIRED
// For frontend public pages consumption
// ===========================================
app.use("/api/v1/public/landing", landingPageRoute);        // Landing page data
app.use("/api/v1/public/subcultures", subculturePublicRoutes); // Public subculture list/detail
app.use("/api/v1/public/lexicons", lexiconRoutes);          // Public lexicon list/detail
app.use("/api/v1/search", searchRoutes);                     // Search functionality
app.use("/api/v1/domains", domainRoutes);                    // Domain list
app.use("/api/v1/public/cultures", culturePublicRoutes);     // Public culture list/detail
app.use("/api/v1/public/regions", regionRoutes);             // Region/province list
app.use("/api/v1/public/references", referencePublicRoutes); // Public reference list
app.use("/api/v1/public/contributors", contributorPublicRoutes); // Public contributor list
app.use("/api/v1/public/assets", assetPublicRoutes);         // Public asset access
app.use("/api/v1/public/about", aboutRoutes);                // About page data

// ===========================================
// SERVER STARTUP
// ===========================================
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});