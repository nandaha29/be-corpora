import { Router } from 'express';
import multer from 'multer';
import * as assetController from '../../controllers/admin/asset.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for upload to blob

// ============================================
// ASSET MANAGEMENT ENDPOINTS
// ============================================

/**
 * @route GET /api/admin/assets
 * @desc Get all assets with pagination
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/', authenticateAdmin, assetController.getAllAssetsPaginated);

/**
 * @route GET /api/admin/assets/search
 * @desc Search assets by name or description
 * @access Admin only
 * @query {string} q - Search query (required)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search', authenticateAdmin, assetController.searchAssets);

/**
 * @route GET /api/admin/assets/filter
 * @desc Filter assets by type and/or status with pagination
 * @access Admin only
 * @query {string} fileType - Filter by type (PHOTO, AUDIO, VIDEO, MODEL_3D)
 * @query {string} status - Filter by status (ACTIVE, PROCESSING, ARCHIVED, CORRUPTED, PUBLISHED)
 * @query {string} sortBy - Sort by field (createdAt, fileName, etc.) (default: createdAt)
 * @query {string} order - Sort order (asc, desc) (default: desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/filter', authenticateAdmin, assetController.filterAssets);

/**
 * @route GET /api/admin/assets/:id
 * @desc Get asset by ID
 * @access Admin only
 * @param {number} id - Asset ID
 */
router.get('/:id', authenticateAdmin, assetController.getAssetById);

/**
 * @route POST /api/admin/assets/upload
 * @desc Upload single asset file
 * @access Admin only
 * @param {file} file - Asset file (PHOTO, AUDIO, VIDEO, MODEL_3D)
 * @body {string} fileName - File name
 * @body {string} fileType - File type (PHOTO, AUDIO, VIDEO, MODEL_3D)
 * @body {string} description - Description (optional)
 * @body {string} url - URL (optional, required for VIDEO and MODEL_3D)
 * @body {string} fileSize - File size (optional)
 * @body {string} hashChecksum - Hash checksum (optional)
 * @body {string} metadataJson - Metadata JSON (optional)
 * @body {string} status - Status (ACTIVE, PROCESSING, ARCHIVED, CORRUPTED, PUBLISHED)
 */
router.post('/upload', authenticateAdmin, upload.single('file'), assetController.createAsset);

/**
 * @route PUT /api/admin/assets/:id
 * @desc Update asset by ID (with optional file upload)
 * @access Admin only
 * @param {number} id - Asset ID
 * @param {file} file - New asset file (optional)
 * @body {string} fileName - File name
 * @body {string} fileType - File type
 * @body {string} description - Description (optional)
 * @body {string} url - URL (optional)
 * @body {string} fileSize - File size (optional)
 * @body {string} hashChecksum - Hash checksum (optional)
 * @body {string} metadataJson - Metadata JSON (optional)
 * @body {string} status - Status
 */
router.put('/:id', authenticateAdmin, upload.single('file'), assetController.updateAsset);

/**
 * @route DELETE /api/admin/assets/:id
 * @desc Delete asset by ID
 * @access Admin only
 * @param {number} id - Asset ID
 */
router.delete('/:id', authenticateAdmin, assetController.deleteAsset);

/**
 * @route POST /api/admin/assets/bulk-upload
 * @desc Upload multiple asset files at once
 * @access Admin only
 * @param {file[]} files - Array of asset files
 * @body {Array} assets - Array of asset metadata objects
 */
router.post('/bulk-upload', authenticateAdmin, upload.array('files'), assetController.bulkUploadAssets);

// ============================================
// ✅ PUBLIC ASSET ENDPOINTS IMPLEMENTED
// ============================================
// Status: Implemented in routes/public/asset.routes.ts
// Route: GET /api/v1/public/assets/:id/file
// Access: Public (no authentication required)
// Requirements: Asset status must be 'PUBLISHED'

// router.get('/public/assets/:id/file', assetController.getPublicAssetFile);


export default router;
