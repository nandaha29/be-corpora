import { Request, Response } from "express";
import * as subcultureService from "../../services/admin/subculture.service.js";
import { createSubcultureSchema, updateSubcultureSchema, createSubcultureAssetSchema, createSubcultureReferenceSchema } from "../../lib/validators.js";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ReferenceRole } from "@prisma/client";

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
      return res.status(404).json({ success: false, message: "Subculture not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Subculture retrieved successfully",
      data: subculture
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch subculture" });
  }
};

export const createSubculture = async (req: Request, res: Response) => {
  try {
    const validatedData = createSubcultureSchema.parse(req.body);
    const newSubculture = await subcultureService.createSubculture(validatedData);
    res.status(201).json({
      success: true,
      message: 'Subculture created successfully',
      data: newSubculture,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create subculture', error: error });
    return;
  }
};


export const updateSubculture = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subculture ID"
      });
    }

    const validatedData = updateSubcultureSchema.parse(req.body);
    const updatedSubculture = await subcultureService.updateSubculture(id, validatedData);

    res.status(200).json({
      success: true,
      message: 'Subculture updated successfully',
      data: updatedSubculture,
    });
    return;
  } catch (error) {
    // console.error('Error updating subculture:', error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }

    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: "Subculture not found"
        });
      }
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: "Unique constraint violation"
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update subculture'
    });
    return;
  }
};

export const deleteSubculture = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await subcultureService.deleteSubculture(id);
    res.status(200).json({
      success: true,
      message: "Subculture deleted successfully"
    });
    return;
  } catch (error) {
    console.error('Error deleting subculture:', error);

    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: "Subculture not found"
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete subculture"
    });
    return;
  }
};

// GET /api/subcultures/:id/assets
export const getSubcultureAssets = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

    const assets = await subcultureService.getSubcultureAssets(id);
    return res.status(200).json({
      success: true,
      message: 'Subculture assets retrieved successfully',
      data: assets
    });
  } catch (error) {
    console.error('Failed to get subculture assets:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve assets' });
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
    const assetRole = req.query.assetRole as string;
    if (Number.isNaN(subcultureId) || Number.isNaN(assetId)) return res.status(400).json({ message: 'Invalid IDs' });
    if (!assetRole) return res.status(400).json({ message: 'Asset role is required as query parameter' });

    await subcultureService.removeAssetFromSubculture(subcultureId, assetId, assetRole as any);
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
      success: true,
      message: "Subcultures retrieved successfully",
      data: subcultures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
      success: true,
      message: "Subcultures retrieved successfully",
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
      conservationStatus: req.query.conservationStatus as string,
      cultureId: req.query.cultureId ? parseInt(req.query.cultureId as string) : undefined,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    // console.log('Filter params received:', filters);

    const result = await subcultureService.getFilteredSubcultures(filters);

    res.status(200).json({
      success: true,
      message: "Subcultures filtered successfully",
      ...result,
    });
  } catch (error) {
    // console.error("Error fetching filtered subcultures:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch filtered subcultures",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// GET /api/v1/admin/subcultures/:id/assigned-assets
export const getAssignedAssets = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });

    const assets = await subcultureService.getAssignedAssets(subcultureId);
    return res.status(200).json({
      success: true,
      message: "Assigned assets retrieved successfully",
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
      success: true,
      message: "Assigned references retrieved successfully",
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
      success: true,
      message: "Assets searched successfully",
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
      success: true,
      message: "References searched successfully",
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
      success: true,
      message: "Asset usage retrieved successfully",
      data: usage,
    });
  } catch (error) {
    console.error('Failed to get asset usage:', error);
    return res.status(500).json({ message: 'Failed to retrieve asset usage' });
  }
};

// GET /api/v1/admin/references/:referenceId/usage
export const getReferenceUsage = async (req: Request, res: Response) => {
  try {
    const referenceId = Number(req.params.referenceId);
    if (Number.isNaN(referenceId)) return res.status(400).json({ message: 'Invalid reference ID' });

    const usage = await subcultureService.getReferenceUsage(referenceId);
    return res.status(200).json({
      success: true,
      message: "Reference usage retrieved successfully",
      data: usage,
    });
  } catch (error) {
    console.error('Failed to get reference usage:', error);
    return res.status(500).json({ message: 'Failed to retrieve reference usage' });
  }
};

// // POST /api/v1/admin/subcultures/:id/references
export const addReferenceToSubculture = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    if (Number.isNaN(subcultureId))
      return res.status(400).json({ message: 'Invalid subculture ID' });

    const { referenceId, lexiconId } = req.body;
    const validated = createSubcultureReferenceSchema.parse({
      subcultureId,
      referenceId,
      lexiconId,
    });

    const result = await subcultureService.addReferenceToSubculture(subcultureId, validated.referenceId, validated.lexiconId);
    return res.status(201).json({
      status: "success",
      message: result.message || 'Add references successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: {
          name: "ZodError",
          message: JSON.stringify(error.issues, null, 2)
        },
      });
    }
    console.error('Failed to add reference to subculture:', error);
    return res.status(500).json({ message: 'Failed to add reference' });
  }
};

// GET /api/v1/admin/subcultures/:id/filter-assets
export const filterSubcultureAssets = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    const type = req.query.type as string | undefined;
    const assetRole = req.query.assetRole as string | undefined;
    const status = req.query.status as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });

    const result = await subcultureService.filterSubcultureAssets(subcultureId, {
      type,
      assetRole,
      status,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Subculture assets filtered successfully",
      ...result,
    });
  } catch (error) {
    console.error('Failed to filter subculture assets:', error);
    return res.status(500).json({ message: 'Failed to filter assets' });
  }
};

// GET /api/v1/admin/subcultures/:id/filter-references
export const filterSubcultureReferences = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    const referenceType = req.query.referenceType as string | undefined;
    const publicationYear = req.query.publicationYear as string | undefined;
    const status = req.query.status as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });

    const result = await subcultureService.filterSubcultureReferences(subcultureId, {
      referenceType,
      publicationYear,
      status,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Subculture references filtered successfully",
      ...result,
    });
  } catch (error) {
    console.error('Failed to filter subculture references:', error);
    return res.status(500).json({ message: 'Failed to filter references' });
  }
};

// POST /api/v1/admin/subcultures/:id/references-direct
// Assign reference directly to SubcultureReference (for subculture page)
export const addReferenceToSubcultureDirect = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    const { referenceId, displayOrder, referenceRole } = req.body;

    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });
    if (!referenceId) return res.status(400).json({ message: 'referenceId is required' });

    // Validate referenceRole - required for linking reference
    if (!referenceRole || referenceRole === '') {
      const issues = [{
        code: 'invalid_value',
        values: Object.values(ReferenceRole),
        path: ['referenceRole'],
        message: `Reference role is required when linking reference. Must be one of: ${Object.values(ReferenceRole).join(', ')}`
      }];
      return res.status(400).json({
        message: 'Validation failed',
        errors: {
          name: "ZodError",
          message: JSON.stringify(issues, null, 2)
        },
      });
    }

    // Validate referenceRole enum
    if (!Object.values(ReferenceRole).includes(referenceRole)) {
      const issues = [{
        code: 'invalid_enum_value',
        options: Object.values(ReferenceRole),
        path: ['referenceRole'],
        message: `Reference role must be one of: ${Object.values(ReferenceRole).join(', ')}`
      }];
      return res.status(400).json({
        message: 'Validation failed',
        errors: {
          name: "ZodError",
          message: JSON.stringify(issues, null, 2)
        },
      });
    }


    const result = await subcultureService.addReferenceToSubcultureDirect(
      subcultureId,
      referenceId,
      displayOrder,
      referenceRole
    );

    return res.status(201).json({
      status: "success",
      message: 'Reference assigned to subculture successfully',
      data: {
        count: 1,
        message: 'Reference assigned to subculture successfully'
      },
    });
  } catch (error: any) {
    console.error('Failed to add reference to subculture:', error);
    if (error.code === 'SUBCULTURE_NOT_FOUND') {
      return res.status(404).json({ message: 'Subculture not found' });
    }
    if (error.code === 'REFERENCE_NOT_FOUND') {
      return res.status(404).json({ message: 'Reference not found' });
    }
    return res.status(500).json({ message: 'Failed to add reference' });
  }
};

// GET /api/v1/admin/subcultures/:id/references-direct
// Get all references assigned directly to subculture
export const getSubcultureReferencesDirect = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);

    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });

    const result = await subcultureService.getSubcultureReferencesDirect(subcultureId);

    return res.status(200).json({
      status: "success",
      message: 'Subculture references retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Failed to get subculture references:', error);
    return res.status(500).json({ message: 'Failed to retrieve references' });
  }
};

// DELETE /api/v1/admin/subcultures/:id/references-direct/:referenceId
// Remove reference from SubcultureReference
export const removeReferenceFromSubcultureDirect = async (req: Request, res: Response) => {
  try {
    const subcultureId = Number(req.params.id);
    const referenceId = Number(req.params.referenceId);

    if (Number.isNaN(subcultureId)) return res.status(400).json({ message: 'Invalid subculture ID' });
    if (Number.isNaN(referenceId)) return res.status(400).json({ message: 'Invalid reference ID' });

    await subcultureService.removeReferenceFromSubcultureDirect(subcultureId, referenceId);

    return res.status(200).json({
      status: "success",
      message: 'Reference removed from subculture successfully',
    });
  } catch (error: any) {
    console.error('Failed to remove reference from subculture:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Reference assignment not found' });
    }
    return res.status(500).json({ message: 'Failed to remove reference' });
  }
};