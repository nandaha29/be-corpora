import { Request, Response } from 'express';
import * as leksikonService from '../../services/admin/leksikon.service.js';
import { createLexiconSchema, updateLexiconSchema, createLexiconAssetSchema, createLexiconReferenceSchema, updateReferenceRoleSchema } from '../../lib/validators.js';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LeksikonAssetRole } from '@prisma/client';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'temp-uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// GET /api/leksikons
// export const getLeksikons = async (req: Request, res: Response) => {
//   try {
//     const items = await leksikonService.getAllLeksikons();
//     return res.status(200).json(items);
//   } catch (error) {
//     console.error('Failed to get leksikons:', error);
//     return res.status(500).json({ message: 'Failed to retrieve leksikons', details: error});
//   }
// };

// GET /api/leksikons/:id
export const getLeksikonById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const item = await leksikonService.getLeksikonById(id);
    if (!item) return res.status(404).json({ 
      success: false,
      message: 'Leksikon not found' 
    });
    return res.status(200).json({
      success: true,
      message: 'Leksikon retrieved successfully',
      data: item,
    });
  } catch (error) {
    console.error('Failed to get leksikon by id:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve leksikon', 
      details: error 
    });
  }
};

// POST /api/leksikons
export const createLeksikon = async (req: Request, res: Response) => {
  try {
    const validated = createLexiconSchema.parse(req.body);
    const created = await leksikonService.createLeksikon(validated);
    return res.status(201).location(`/api/leksikons/${created.lexiconId}`).json({
      success: true,
      message: 'Leksikon created successfully',
      data: created,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors: error 
      });
    }
    if ((error as any)?.code === 'DOMAIN_NOT_FOUND') {
      return res.status(400).json({ 
        success: false,
        message: 'Referenced domain (domainKodifikasiId) does not exist' 
      });
    }
    if ((error as any)?.code === 'CONTRIBUTOR_NOT_FOUND') {
      return res.status(400).json({ 
        success: false,
        message: 'Referenced contributor does not exist' 
      });
    }
    console.error('Failed to create leksikon:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to create leksikon', 
      details: error 
    });
  }
};

// PUT /api/leksikons/:id
export const updateLeksikon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const validated = updateLexiconSchema.parse(req.body);
    const updated = await leksikonService.updateLeksikon(id, validated);
    return res.status(200).json({
      success: true,
      message: 'Leksikon updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors: error 
      });
    }
    if ((error as any)?.code === 'DOMAIN_NOT_FOUND') {
      return res.status(400).json({ 
        success: false,
        message: 'Referenced domain (domainKodifikasiId) does not exist' 
      });
    }
    if ((error as any)?.code === 'CONTRIBUTOR_NOT_FOUND') {
      return res.status(400).json({ 
        success: false,
        message: 'Referenced contributor does not exist' 
      });
    }
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Leksikon not found' 
      });
    }
    console.error('Failed to update leksikon:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to update leksikon',
      details: error 
    });
  }
};

// DELETE /api/leksikons/:id
export const deleteLeksikon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    await leksikonService.deleteLeksikon(id);
      res.status(200).json({
      success: true,
      message: 'Leksikon deleted successfully',
    });
    return;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Leksikon not found' 
      });
    }
    console.error('Failed to delete leksikon:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to delete leksikon', 
      details: error 
    });
  }
};

// GET /api/leksikons/:id/assets
export const getLeksikonAssets = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const assets = await leksikonService.getLeksikonAssets(id);
    return res.status(200).json({
      success: true,
      message: 'Leksikon assets retrieved successfully',
      total: assets.length,
      data: assets,
    });
  } catch (error) {
    console.error('Failed to get leksikon assets:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve assets', 
      details: error 
    });
  }
};

// POST /api/leksikons/:id/assets
// export const addAssetToLeksikon = async (req: Request, res: Response) => {
//   try {
//     const leksikonId = Number(req.params.id);
//     if (Number.isNaN(leksikonId)) return res.status(400).json({ message: 'Invalid leksikon ID' });

//     const { assetId, assetRole } = req.body;
//     const validated = createLeksikonAssetSchema.parse({ leksikonId, assetId, assetRole });

//     const result = await leksikonService.addAssetToLeksikon(leksikonId, assetId, assetRole);
//     return res.status(201).json(result);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return res.status(400).json({ message: 'Validation failed', errors: error });
//     }
//     if ((error as any)?.code === 'LEKSIKON_NOT_FOUND') {
//       return res.status(404).json({ message: 'Leksikon not found' });
//     }
//     if ((error as any)?.code === 'ASSET_NOT_FOUND') {
//       return res.status(404).json({ message: 'Asset not found' });
//     }
//     console.error('Failed to add asset to leksikon:', error);
//     return res.status(500).json({ message: 'Failed to add asset', details: error });
//   }
// };

// POST /api/leksikons/:id/assets
export const addAssetToLeksikon = async (req: Request, res: Response) => {
  try {
    const leksikonId = Number(req.params.id);
    if (Number.isNaN(leksikonId)) {
      return res.status(400).json({ message: 'Invalid leksikon ID' });
    }

    const { assetId, assetRole } = req.body;

    // Validasi input dengan Zod
    const validated = createLexiconAssetSchema.parse({
      lexiconId: leksikonId,
      assetId,
      assetRole,
    });

    // Lakukan upsert di service agar tidak duplikat
    const result = await leksikonService.addAssetToLeksikon(
      validated.lexiconId,
      validated.assetId,
      validated.assetRole
    );

    return res.status(201).json({
      success: true,
      message: 'Asset successfully linked to leksikon',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error,
      });
    }

    if ((error as any)?.code === 'LEKSIKON_NOT_FOUND') {
      return res.status(404).json({ 
        success: false,
        message: 'Leksikon not found' 
      });
    }
    if ((error as any)?.code === 'ASSET_NOT_FOUND') {
      return res.status(404).json({ 
        success: false,
        message: 'Asset not found' 
      });
    }

    console.error('Failed to add asset to leksikon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add asset to leksikon',
      details: error instanceof Error ? error.message : error,
    });
  }
};


// DELETE /api/leksikons/:id/assets/:assetId
export const removeAssetFromLeksikon = async (req: Request, res: Response) => {
  try {
    const leksikonId = Number(req.params.id);
    const assetId = Number(req.params.assetId);
    if (Number.isNaN(leksikonId) || Number.isNaN(assetId)) return res.status(400).json({ message: 'Invalid IDs' });

    await leksikonService.removeAssetFromLeksikon(leksikonId, assetId);
    return res.status(200).json({
      success: true,
      message: 'Asset removed from leksikon successfully',
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Association not found' 
      });
    }
    console.error('Failed to remove asset from leksikon:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to remove asset', 
      details: error 
    });
  }
};

// GET /api/leksikons/:id/references
export const getLeksikonReferences = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const references = await leksikonService.getLeksikonReferences(id);
    return res.status(200).json({
      success: true,
      message: 'Leksikon references retrieved successfully',
      total: references.length,
      data: references,
    });
  } catch (error) {
    console.error('Failed to get leksikon references:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve references', 
      details: error 
    });
  }
};

// POST /api/leksikons/:id/references
// export const addReferenceToLeksikon = async (req: Request, res: Response) => {
//   try {
//     const leksikonId = Number(req.params.id);
//     if (Number.isNaN(leksikonId)) return res.status(400).json({ message: 'Invalid leksikon ID' });

//     const { referensiId, citationNote } = req.body;
//     const validated = createLeksikonReferensiSchema.parse({ leksikonId, referensiId, citationNote });

//     const result = await leksikonService.addReferenceToLeksikon(leksikonId, referensiId, citationNote);
//     return res.status(201).json(result);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return res.status(400).json({ message: 'Validation failed', errors: error });
//     }
//     if ((error as any)?.code === 'LEKSIKON_NOT_FOUND') {
//       return res.status(404).json({ message: 'Leksikon not found' });
//     }
//     if ((error as any)?.code === 'REFERENSI_NOT_FOUND') {
//       return res.status(404).json({ message: 'Referensi not found' });
//     }
//     console.error('Failed to add reference to leksikon:', error);
//     return res.status(500).json({ message: 'Failed to add reference', details: error });
//   }
// };

// POST /api/leksikons/:id/references
export const addReferenceToLeksikon = async (req: Request, res: Response) => {
  try {
    const leksikonId = Number(req.params.id);
    if (Number.isNaN(leksikonId))
      return res.status(400).json({ message: 'Invalid leksikon ID' });

    const { referenceId, referenceRole } = req.body;
    const validated = createLexiconReferenceSchema.parse({
      lexiconId: leksikonId,
      referenceId,
      referenceRole,
    });

    const result = await leksikonService.addReferenceToLeksikon(
      validated.lexiconId,
      validated.referenceId,
      validated.referenceRole
    );

    return res.status(201).json({
      success: true,
      message: 'Reference successfully linked to leksikon',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error,
      });
    }
    if ((error as any)?.code === 'LEKSIKON_NOT_FOUND') {
      return res.status(404).json({ 
        success: false,
        message: 'Leksikon not found' 
      });
    }
    if ((error as any)?.code === 'REFERENSI_NOT_FOUND') {
      return res.status(404).json({ 
        success: false,
        message: 'Referensi not found' 
      });
    }

    console.error('Failed to add reference to leksikon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add reference to leksikon',
      details: error instanceof Error ? error.message : error,
    });
  }
};


// DELETE /api/leksikons/:id/references/:referenceId
export const removeReferenceFromLeksikon = async (req: Request, res: Response) => {
  try {
    const leksikonId = Number(req.params.id);
    const referensiId = Number(req.params.referenceId);
    if (Number.isNaN(leksikonId) || Number.isNaN(referensiId)) return res.status(400).json({ message: 'Invalid IDs' });

    await leksikonService.removeReferenceFromLeksikon(leksikonId, referensiId);
    return res.status(200).json({
      success: true,
      message: 'Reference removed from leksikon successfully',
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        message: 'Association not found' 
      });
    }
    console.error('Failed to remove reference from leksikon:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to remove reference', 
      details: error 
    });
  }
};

// PUT /api/leksikons/:id/assets/:assetId/role
export const updateAssetRole = async (req: Request, res: Response) => {
  try {
    const leksikonId = Number(req.params.id);
    const assetId = Number(req.params.assetId);
    const { assetRole } = req.body;

    if (Number.isNaN(leksikonId) || Number.isNaN(assetId))
      return res.status(400).json({ message: 'Invalid IDs' });

    if (!assetRole)
      return res.status(400).json({ message: 'assetRole is required' });

    const result = await leksikonService.updateAssetRole(
      leksikonId,
      assetId,
      assetRole as LeksikonAssetRole
    );

    return res.status(200).json({
      success: true,
      message: 'Asset role updated successfully',
      data: result,
    });
  } catch (error) {
    if ((error as any)?.code === 'ASSOCIATION_NOT_FOUND')
      return res.status(404).json({ 
        success: false,
        message: 'Asset relation not found' 
      });

    console.error('Failed to update asset role:', error);
    return res
      .status(500)
      .json({ 
        success: false,
        message: 'Failed to update asset role', 
        details: error 
      });
  }
};

// PUT /api/v1/leksikons/:id/references/:referenceId
export const updateReferenceRole = async (req: Request, res: Response) => {
  try {
    const leksikonId = Number(req.params.id);
    const referenceId = Number(req.params.referenceId);

    if (Number.isNaN(leksikonId) || Number.isNaN(referenceId))
      return res.status(400).json({ message: 'Invalid IDs' });

    const validated = updateReferenceRoleSchema.parse(req.body);
    const result = await leksikonService.updateReferenceRole(
      leksikonId,
      referenceId,
      validated.referenceRole
    );

    return res.status(200).json({
      success: true,
      message: 'Reference role updated successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors: error 
      });
    }
    if ((error as any)?.code === 'ASSOCIATION_NOT_FOUND')
      return res.status(404).json({ 
        success: false,
        message: 'Reference relation not found' 
      });

    console.error('Failed to update reference role:', error);
    return res
      .status(500)
      .json({ 
        success: false,
        message: 'Failed to update citation note', 
        details: error 
      });
  }
};

export const getAllLeksikonsPaginated = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const result = await leksikonService.getAllLeksikonsPaginated(page, limit);
    res.status(200).json({
      success: true,
      message: 'Leksikons retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
    return;
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch leksikons", 
      error 
    });
    return;
  }
};

export const getLeksikonsByDomain = async (req: Request, res: Response) => {
  const dk_id = parseInt(req.params.dk_id || '0');
  try {
    const data = await leksikonService.getLeksikonsByDomain(dk_id);
    res.status(200).json({
      success: true,
      message: 'Leksikons retrieved successfully',
      data: data
    });
    return;
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch leksikons by domain", 
      error 
    });
    return;
  }
};

export const getLeksikonsByStatus = async (req: Request, res: Response) => {
  const status = req.query.status as string;
  try {
    const data = await leksikonService.getLeksikonsByStatus(status);
    res.status(200).json({
      success: true,
      message: 'Leksikons retrieved successfully',
      data: data
    });
    return;
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch leksikons by status", 
      error 
    });
    return;
  }
};

// GET /api/admin/leksikons/filter - Filter by status and/or domain with pagination
export const filterLeksikons = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const domainId = req.query.domainId ? parseInt(req.query.domainId as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await leksikonService.filterLeksikons({
      status,
      domainId,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'Leksikons filtered successfully',
      data: result.data,
      pagination: result.meta,
    });
    return;
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to filter leksikons", 
      error 
    });
    return;
  }
};

export const updateLeksikonStatus = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id || '0');
  const { status } = req.body;

  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid status value" 
    });
  }

  try {
    const updated = await leksikonService.updateLeksikonStatus(id, status);
    res.status(200).json({
      success: true,
      message: 'Leksikon status updated successfully',
      data: updated,
    });
    return;
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to update leksikon status", 
      error 
    });
    return;
  }
};

// PUT /api/leksikons/:id/assets/:assetId/role
// GET /api/leksikons/:id/assets/role/:assetRole
export const getAssetsByRole = async (req: Request, res: Response) => {
  try {
    const leksikonId = Number(req.params.id);
    const assetRole = req.params.assetRole;

    if (Number.isNaN(leksikonId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid leksikon ID' 
      });
    }

    if (!assetRole || typeof assetRole !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'assetRole is required and must be a string' 
      });
    }

    // Validate assetRole enum values
    const validRoles = ['GALLERY', 'PRONUNCIATION', 'VIDEO_DEMO', 'MODEL_3D'];
    if (!validRoles.includes(assetRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assetRole',
        validRoles
      });
    }

    const assets = await leksikonService.getAssetsByRole(leksikonId, assetRole as LeksikonAssetRole);
    return res.status(200).json({
      success: true,
      message: `Assets with role ${assetRole} retrieved successfully`,
      total: assets.length,
      data: assets,
    });
  } catch (error) {
    console.error('Failed to get assets by role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assets',
      details: error
    });
  }
};

// ============================================
// 🔍 SEARCH & USAGE TRACKING CONTROLLERS
// ============================================

// GET /api/admin/leksikons/search/assets - Search assets used in lexicons
export const searchAssetsInLeksikons = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await leksikonService.searchAssetsInLeksikons(query, page, limit);
    return res.status(200).json({
      success: true,
      message: 'Assets searched successfully',
      ...result
    });
  } catch (error) {
    console.error('Failed to search assets in leksikons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search assets',
      details: error instanceof Error ? error.message : error
    });
  }
};

// GET /api/admin/leksikons/assets/assigned - Get all assets assigned to lexicons
export const getAssignedAssets = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await leksikonService.getAssignedAssets(page, limit);
    return res.status(200).json({
      success: true,
      message: 'Assigned assets retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Failed to get assigned assets:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assigned assets',
      details: error instanceof Error ? error.message : error
    });
  }
};

// GET /api/admin/leksikons/assets/:assetId/usages - Get which leksikons use this asset
export const getAssetUsage = async (req: Request, res: Response) => {
  try {
    const assetId = parseInt(req.params.assetId || '0');
    if (isNaN(assetId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid asset ID' 
      });
    }

    const usages = await leksikonService.getAssetUsage(assetId);
    return res.status(200).json({
      success: true,
      message: 'Asset usage retrieved successfully',
      data: usages
    });
  } catch (error) {
    console.error('Failed to get asset usage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve asset usage',
      details: error instanceof Error ? error.message : error
    });
  }
};

// GET /api/admin/leksikons/search/references - Search references used in lexicons
export const searchReferencesInLeksikons = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await leksikonService.searchReferencesInLeksikons(query, page, limit);
    return res.status(200).json({
      success: true,
      message: 'References searched successfully',
      ...result
    });
  } catch (error) {
    console.error('Failed to search references in leksikons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search references',
      details: error instanceof Error ? error.message : error
    });
  }
};

// GET /api/admin/leksikons/references/assigned - Get all references assigned to lexicons
export const getAssignedReferences = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await leksikonService.getAssignedReferences(page, limit);
    return res.status(200).json({
      success: true,
      message: 'Assigned references retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Failed to get assigned references:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assigned references',
      details: error instanceof Error ? error.message : error
    });
  }
};

// GET /api/admin/leksikons/references/:referenceId/usages - Get which leksikons use this reference
export const getReferenceUsage = async (req: Request, res: Response) => {
  try {
    const referenceId = parseInt(req.params.referenceId || '0');
    if (isNaN(referenceId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid reference ID' 
      });
    }

    const usages = await leksikonService.getReferenceUsage(referenceId);
    return res.status(200).json({
      success: true,
      message: 'Reference usage retrieved successfully',
      data: usages
    });
  } catch (error) {
    console.error('Failed to get reference usage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reference usage',
      details: error instanceof Error ? error.message : error
    });
  }
};

// GET /api/admin/leksikons/filter/assets - Filter assets assigned to lexicons by Type, Status, Created At
export const filterLeksikonAssets = async (req: Request, res: Response) => {
  try {
    const filters = {
      fileType: req.query.fileType as string,
      status: req.query.status as string,
      createdAt: req.query.createdAt as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    };

    const result = await leksikonService.filterLeksikonAssets(filters);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to filter leksikon assets:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to filter leksikon assets',
      details: error instanceof Error ? error.message : error
    });
  }
};

// GET /api/admin/leksikons/filter/references - Filter references assigned to lexicons by Type, Year, Status
export const filterLeksikonReferences = async (req: Request, res: Response) => {
  try {
    const filters = {
      referenceType: req.query.referenceType as string,
      publicationYear: req.query.publicationYear as string,
      status: req.query.status as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    };

    const result = await leksikonService.filterLeksikonReferences(filters);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to filter leksikon references:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to filter leksikon references',
      details: error instanceof Error ? error.message : error
    });
  }
};

// POST /api/admin/leksikons/import - Bulk import leksikons from CSV
export const bulkImportLeksikons = [
  (req: Request, res: Response, next: any) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'File too large. Maximum size is 10MB.',
            });
          }
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }
      next();
      return; // Ensure all code paths return a value
    });
  },
  async (req: Request, res: Response) => {
    try {
      console.log('Uploaded file info:', req.file); // Debug log
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please upload a CSV file.',
        });
      }

      const filePath = req.file.path;
      console.log('File path:', filePath); // Debug log
      const result = await leksikonService.bulkImportLeksikonsFromCSV(filePath);

      return res.status(200).json({
        success: true,
        message: 'Bulk import completed',
        data: result,
      });
    } catch (error) {
      console.error('Bulk import failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Bulk import failed',
        details: error instanceof Error ? error.message : error,
      });
    }
  },
];