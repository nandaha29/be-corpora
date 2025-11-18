import { Request, Response } from "express";
import * as subcultureService from "../../services/admin/subculture.service.js";
import { createSubcultureSchema, updateSubcultureSchema, createSubcultureAssetSchema } from "../../lib/validators.js";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// export const getAllSubcultures = async (req: Request, res: Response) => {
//   try {
//     const subcultures = await subcultureService.getAllSubcultures();
//     res.json(subcultures);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch subcultures" });
//   }
// };

export const getSubcultureById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const subculture = await subcultureService.getSubcultureById(id);
    if (!subculture) {
      return res.status(404).json({ error: "Subculture not found" });
    }
    return res.json(subculture);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch subculture" });
  }
};

export const createSubculture = async (req: Request, res: Response) => {
  try {
    const parsed = createSubcultureSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    const subculture = await subcultureService.createSubculture(parsed.data);
    return res.status(201).json(subculture);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const updateSubculture = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log('UpdateSubculture controller called with id:', id);
    console.log('Request body:', req.body);
    
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid subculture ID" });
    }

    const parsed = updateSubcultureSchema.safeParse(req.body);
    console.log('Validation result:', parsed);
    
    if (!parsed.success) {
      console.log('Validation errors:', parsed.error);
      return res.status(400).json({ error: parsed.error });
    }

    console.log('Parsed data:', parsed.data);
    const subculture = await subcultureService.updateSubculture(id, parsed.data);
    return res.json(subculture);
  } catch (error) {
    console.error('Error updating subculture:', error);

    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: "Subculture not found" });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({ error: "Unique constraint violation" });
      }
    }

    return res.status(500).json({ error: "Failed to update subculture", details: (error as Error).message });
  }
};

export const deleteSubculture = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await subcultureService.deleteSubculture(id);
    return res.json({ message: "Subculture deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete subculture" });
  }
};

// GET /api/subcultures/:id/assets
export const getSubcultureAssets = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const assets = await subcultureService.getSubcultureAssets(id);
    return res.status(200).json(assets);
  } catch (error) {
    console.error('Failed to get subculture assets:', error);
    return res.status(500).json({ message: 'Failed to retrieve assets' });
  }
};

// POST /api/subcultures/:id/assets
export const addAssetToSubculture = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });

    const { assetId, assetRole } = req.body;
    const validated = createSubcultureAssetSchema.parse({ subcultureId, assetId, assetRole });

    const result = await subcultureService.addAssetToSubculture(subcultureId, assetId, assetRole);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error });
    }
    if ((error as any)?.code === 'SUBCULTURE_NOT_FOUND') {
      return res.status(404).json({ message: 'Subculture not found' });
    }
    if ((error as any)?.code === 'ASSET_NOT_FOUND') {
      return res.status(404).json({ message: 'Asset not found' });
    }
    console.error('Failed to add asset to subculture:', error);
    return res.status(500).json({ message: 'Failed to add asset', details: error });
  }
};

// DELETE /api/subcultures/:id/assets/:assetId
export const removeAssetFromSubculture = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    const assetId = Number(req.params.assetId);
    const assetRole = req.body.assetRole;
    if (Number.isNaN(subcultureId) || Number.isNaN(assetId)) return res.status(400).json({ message: 'Invalid IDs' });
    if (!assetRole) return res.status(400).json({ message: 'Asset role is required' });

    await subcultureService.removeAssetFromSubculture(subcultureId, assetId, assetRole);
    return res.status(200).json({ message: 'Asset removed from subculture' });
  } catch (error) {
    if ((error as any)?.code === 'ASSOCIATION_NOT_FOUND') {
      return res.status(404).json({ message: 'Association not found' });
    }
    console.error('Failed to remove asset from subculture:', error);
    return res.status(500).json({ message: 'Failed to remove asset' });
  }
};

// GET /api/v1/subcultures?page=1&limit=10
export const getAllSubculturesPaginated = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { subcultures, total } = await subcultureService.getAllSubculturesPaginated(skip, limit);

    res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      data: subcultures,
    });
  } catch (error) {
    console.error("Error fetching paginated subcultures:", error);
    res.status(500).json({ error: "Failed to fetch subcultures (paginated)" });
  }
};

// GET /api/v1/cultures/:culture_id/subcultures
export const getSubculturesByCulture = async (req: Request, res: Response) => {
  try {
    // Accept either `culture_id` (snake_case) or `cultureId` (camelCase) depending on route
    const raw = req.params.culture_id ?? req.params.cultureId ?? req.params.cultureId;
    const cultureId = Number(raw);
    if (Number.isNaN(cultureId)) return res.status(400).json({ error: "Invalid culture_id" });

    const subcultures = await subcultureService.getSubculturesByCulture(cultureId);

    if (!subcultures || subcultures.length === 0) {
      return res.status(404).json({ message: "No subcultures found for this culture" });
    }

    return res.status(200).json({
      status: "success",
      data: subcultures,
    });
  } catch (error) {
    console.error("Error fetching subcultures by culture:", error);
    return res.status(500).json({ error: "Failed to fetch subcultures by culture" });
  }
};

// GET /api/v1/admin/subcultures/filter
export const getFilteredSubcultures = async (req: Request, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      statusPriorityDisplay: req.query.statusPriorityDisplay as string,
      statusKonservasi: req.query.statusKonservasi as string,
      cultureId: req.query.cultureId ? parseInt(req.query.cultureId as string) : undefined,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await subcultureService.getFilteredSubcultures(filters);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching filtered subcultures:", error);
    res.status(500).json({ error: "Failed to fetch filtered subcultures" });
  }
};

// GET /api/v1/admin/subcultures/:id/assigned-assets
export const getAssignedAssets = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });

    const assets = await subcultureService.getAssignedAssets(subcultureId);
    return res.status(200).json({
      status: "success",
      data: assets,
    });
  } catch (error) {
    console.error('Failed to get assigned assets:', error);
    return res.status(500).json({ message: 'Failed to retrieve assigned assets' });
  }
};

// GET /api/v1/admin/subcultures/:id/assigned-references
export const getAssignedReferences = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });

    const references = await subcultureService.getAssignedReferences(subcultureId);
    return res.status(200).json({
      status: "success",
      data: references,
    });
  } catch (error) {
    console.error('Failed to get assigned references:', error);
    return res.status(500).json({ message: 'Failed to retrieve assigned references' });
  }
};

// GET /api/v1/admin/subcultures/:id/search-assets
export const searchAssetsInSubculture = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    const searchQuery = req.query.q as string;

    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });
    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const assets = await subcultureService.searchAssetsInSubculture(subcultureId, searchQuery.trim());
    return res.status(200).json({
      status: "success",
      data: assets,
    });
  } catch (error) {
    console.error('Failed to search assets in subculture:', error);
    return res.status(500).json({ message: 'Failed to search assets' });
  }
};

// GET /api/v1/admin/subcultures/:id/search-references
export const searchReferencesInSubculture = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    const searchQuery = req.query.q as string;

    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });
    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const references = await subcultureService.searchReferencesInSubculture(subcultureId, searchQuery.trim());
    return res.status(200).json({
      status: "success",
      data: references,
    });
  } catch (error) {
    console.error('Failed to search references in subculture:', error);
    return res.status(500).json({ message: 'Failed to search references' });
  }
};

// GET /api/v1/admin/assets/:assetId/usage
export const getAssetUsage = async (req: Request, res: Response) => {
  try {
    const assetId = Number(req.params.assetId);
    if (Number.isNaN(assetId)) return res.status(400).json({ message: 'Invalid asset ID' });

    const usage = await subcultureService.getAssetUsage(assetId);
    return res.status(200).json({
      status: "success",
      data: usage,
    });
  } catch (error) {
    console.error('Failed to get asset usage:', error);
    return res.status(500).json({ message: 'Failed to retrieve asset usage' });
  }
};

// GET /api/v1/admin/references/:referensiId/usage
export const getReferenceUsage = async (req: Request, res: Response) => {
  try {
    const referensiId = Number(req.params.referensiId);
    if (Number.isNaN(referensiId)) return res.status(400).json({ message: 'Invalid reference ID' });

    const usage = await subcultureService.getReferenceUsage(referensiId);
    return res.status(200).json({
      status: "success",
      data: usage,
    });
  } catch (error) {
    console.error('Failed to get reference usage:', error);
    return res.status(500).json({ message: 'Failed to retrieve reference usage' });
  }
};
