import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticateAdmin } from './middleware/auth.middleware.js';
import adminRoutes from './routes/admin/admin.routes.js';
import cultureRoutes from './routes/admin/culture.routes.js';
import contributorRoutes from './routes/admin/contributor.routes.js';
import referensiRoutes from './routes/admin/reference.routes.js';
import assetRoutes from './routes/admin/asset.routes.js';
import subcultureRoutes from './routes/admin/subculture.routes.js';
import domainKodifikasiRoutes from './routes/admin/domainKodifikasi.routes.js';
import leksikonRoutes from './routes/admin/leksikon.routes.js';

import landingPageRoute from "./routes/public/landingPage.routes.js";
import subculturePublicRoutes from "./routes/public/subculture.routes.js";
import lexiconRoutes from "./routes/public/lexicon.routes.js";
import searchRoutes from "./routes/public/search.routes.js";
import domainRoutes from "./routes/public/domain.routes.js";
import culturePublicRoutes from "./routes/public/culture.routes.js";
import regionRoutes from "./routes/public/region.routes.js";
// import culturalItemsRoutes from "./routes/public/culturalItems.routes.js";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// A simple test route
app.get('/api', (req: Request, res: Response) => {
  res.send('Leksikon Backend API is running!');
});

// Admin authentication routes (public)
app.use('/api/v1/admin/auth', adminRoutes);

// Admin routes (protected - require authentication)
app.use('/api/v1/admin/cultures', authenticateAdmin, cultureRoutes);
app.use('/api/v1/admin/contributors', authenticateAdmin, contributorRoutes);
app.use('/api/v1/admin/referensi', authenticateAdmin, referensiRoutes);
app.use('/api/v1/admin/assets', authenticateAdmin, assetRoutes);
app.use("/api/v1/admin/subcultures", authenticateAdmin, subcultureRoutes);
app.use("/api/v1/admin/domain-kodifikasi", authenticateAdmin, domainKodifikasiRoutes);
app.use('/api/v1/admin/leksikons', authenticateAdmin, leksikonRoutes);

//public
app.use("/api/v1/public/landing", landingPageRoute);
app.use("/api/v1/public/subcultures", subculturePublicRoutes);
app.use("/api/v1/public/lexicons", lexiconRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/domains", domainRoutes);
app.use("/api/v1/public/cultures", culturePublicRoutes);
app.use("/api/v1/public/regions", regionRoutes);
// app.use("/api/v1/public/cultural-items", culturalItemsRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});