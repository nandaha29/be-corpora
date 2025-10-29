import { Request, Response } from 'express';
import * as contributorService from '../../services/admin/contributor.service.js';
import { createContributorSchema, updateContributorSchema, createContributorAssetSchema } from '../../lib/validators.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

// GET all contributors
// export const getContributors = async (req: Request, res: Response) => {
//   try {
//     const contributors = await contributorService.getAllContributors();
//     res.status(200).json({
//       success: true,
//       message: 'Contributors retrieved successfully',
//       data: contributors,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to retrieve contributors' });
//   }
// };

// GET all contributors (with pagination)
export const getContributors = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await contributorService.getAllContributorsPaginated(page, limit);

    res.status(200).json({
      success: true,
      message: 'Contributors retrieved successfully',
      ...result, // akan menampilkan data, total, page, totalPages
    });
    return;
  } catch (error) {
    console.error('Error retrieving contributors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contributors',
    });
    return;
  }
};


// GET contributor by ID
export const getContributorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contributor = await contributorService.getContributorById(Number(id));
    if (!contributor) {
      return res.status(404).json({ success: false, message: 'Contributor not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Contributor retrieved successfully',
      data: contributor,
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve contributor' });
    return;
  }
};

// POST contributor
export const createContributor = async (req: Request, res: Response) => {
  try {
    const validatedData = createContributorSchema.parse(req.body);
    const newContributor = await contributorService.createContributor(validatedData);
    res.status(201).json({
      success: true,
      message: 'Contributor created successfully',
      data: newContributor,
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
    res.status(500).json({ success: false, message: 'Failed to create contributor' });
    return;
  }
};

// PUT contributor
export const updateContributor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const validatedData = updateContributorSchema.parse(req.body);
    const updatedContributor = await contributorService.updateContributor(id, validatedData);
    res.status(200).json({
      success: true,
      message: 'Contributor updated successfully',
      data: updatedContributor,
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
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ success: false, message: 'Contributor not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to update contributor' });
    return;
  }
};

// DELETE contributor
export const deleteContributor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await contributorService.deleteContributor(id);
    res.status(200).json({
      success: true,
      message: 'Contributor deleted successfully',
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return res.status(404).json({ success: false, message: 'Contributor not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to delete contributor' });
    return;
  }
};

// SEARCH contributors
export const searchContributors = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter q is required',
      });
    }

    const results = await contributorService.searchContributors(q);
    res.status(200).json({
      success: true,
      message: `Found ${results.length} contributors matching "${q}"`,
      data: results,
    });
    return;
  } catch (error) {
    console.error('Error searching contributors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search contributors',
    });
    return;
  }
};

// GET contributor assets
export const getContributorAssets = async (req: Request, res: Response) => {
  try {
    const contributorId = Number(req.params.id);
    const assets = await contributorService.getContributorAssets(contributorId);
    res.status(200).json({
      success: true,
      message: 'Contributor assets retrieved successfully',
      data: assets,
    });
    return;
  } catch (error) {
    console.error('Error retrieving contributor assets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contributor assets',
    });
    return;
  }
};

// POST add asset to contributor
export const addAssetToContributor = async (req: Request, res: Response) => {
  try {
    const contributorId = Number(req.params.id);
    if (Number.isNaN(contributorId)) return res.status(400).json({ message: 'Invalid contributor ID' });

    const { assetId, assetNote } = req.body;
    const validated = createContributorAssetSchema.parse({ contributorId, assetId, assetNote });

    const result = await contributorService.addAssetToContributor(contributorId, assetId, assetNote);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error });
    }
    if ((error as any)?.code === 'CONTRIBUTOR_NOT_FOUND') {
      return res.status(404).json({ message: 'Contributor not found' });
    }
    if ((error as any)?.code === 'ASSET_NOT_FOUND') {
      return res.status(404).json({ message: 'Asset not found' });
    }
    console.error('Failed to add asset to contributor:', error);
    return res.status(500).json({ message: 'Failed to add asset', details: error });
  }
};

// DELETE remove asset from contributor
export const removeAssetFromContributor = async (req: Request, res: Response) => {
  try {
    const contributorId = Number(req.params.id);
    const assetId = Number(req.params.assetId);
    if (Number.isNaN(contributorId) || Number.isNaN(assetId)) return res.status(400).json({ message: 'Invalid IDs' });

    await contributorService.removeAssetFromContributor(contributorId, assetId);
    return res.status(200).json({ message: 'Asset removed from contributor' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Association not found' });
    }
    console.error('Failed to remove asset from contributor:', error);
    return res.status(500).json({ message: 'Failed to remove asset' });
  }
};
