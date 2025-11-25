import { Request, Response } from 'express';
import * as cultureService from '../../services/admin/culture.service.js';
import { createCultureSchema, updateCultureSchema } from '../../lib/validators.js';
import { ZodError } from 'zod';
import { StatusKonservasi, StatusPublish } from '@prisma/client';

// ✅ GET all cultures
// export const getCultures = async (req: Request, res: Response) => {
//   try {
//     const page = 1;
//     const limit = 10;
//     const cultures = await cultureService.getAllCultures(page, limit);
//     res.status(200).json({
//       success: true,
//       message: 'Successfully retrieved all cultures',
//       data: cultures,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to retrieve cultures' });
//   }
// };

// ✅ GET all cultures with pagination
export const getAllCulturesPaginated = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await cultureService.getAllCulturesPaginated(page, limit);
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved all cultures',
      ...result, // akan menampilkan data, total, page, totalPages
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve cultures' });
    return;
  }
};


// ✅ GET a single culture by ID
export const getCultureById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const culture = await cultureService.getCultureById(Number(id));
    if (!culture) {
      return res.status(404).json({ success: false, message: 'Culture not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved culture',
      data: culture,
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve culture' });
    return;
  }
};

// ✅ POST a new culture
export const createCulture = async (req: Request, res: Response) => {
  try {
    const validatedData = createCultureSchema.parse(req.body);
    const newCulture = await cultureService.createCulture(validatedData);
    res.status(201).json({
      success: true,
      message: 'Culture created successfully',
      data: newCulture,
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
    res.status(500).json({ success: false, message: 'Failed to create culture' });
    return;
  }
};

// ✅ PUT (update) a culture
export const updateCulture = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const validatedData = updateCultureSchema.parse(req.body);

    const updatedCulture = await cultureService.updateCulture(id, validatedData);
    res.status(200).json({
      success: true,
      message: 'Culture updated successfully',
      data: updatedCulture,
    });
    return;
  } catch (error) {
    console.error('Error updating culture:', error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ success: false, message: 'Culture not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to update culture' });
    return;
  }
};

// ✅ DELETE a culture
export const deleteCulture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await cultureService.deleteCulture(Number(id));
    res.status(200).json({
      success: true,
      message: 'Culture deleted successfully',
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return res.status(404).json({ success: false, message: 'Culture not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to delete culture' });
    return;
  }
};

// controllers/culture.controller.ts
export async function getCultureWithAssets(req: Request, res: Response) {
  const cultureId = Number(req.params.cultureId);
  try {
    const data = await cultureService.getCultureWithAssets(cultureId);
    if (!data) return res.status(404).json({ message: "Culture not found" });

    const assetsSubculture = data.subcultures
      .flatMap((sub: { subcultureAssets: any[]; }) => sub.subcultureAssets.map((sa) => sa.asset))
      .slice(0, 4); // ambil maksimal 4 foto

    res.json({
      cultureId: data.cultureId,
      cultureName: data.cultureName,
      assetsSubculture,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

// ✅ SEARCH cultures
export const searchCultures = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const searchQuery = req.query.q as string;

    const result = await cultureService.searchCultures(page, limit, searchQuery);

    res.status(200).json({
      success: true,
      message: 'Successfully searched cultures',
      ...result,
    });
    return;
  } catch (error) {
    console.error('Error searching cultures:', error);
    res.status(500).json({ success: false, message: 'Failed to search cultures' });
    return;
  }
};

// ✅ FILTER cultures (separate from search)
export const filterCultures = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const conservationStatus = req.query.conservationStatus as StatusKonservasi;
    const status = req.query.status as StatusPublish;
    const originIsland = req.query.originIsland as string;
    const province = req.query.province as string;
    const cityRegion = req.query.cityRegion as string;

    const result = await cultureService.filterCultures(
      page,
      limit,
      conservationStatus,
      status,
      originIsland,
      province,
      cityRegion
    );

    res.status(200).json({
      success: true,
      message: 'Successfully filtered cultures',
      ...result,
    });
    return;
  } catch (error) {
    console.error('Error filtering cultures:', error);
    res.status(500).json({ success: false, message: 'Failed to filter cultures' });
    return;
  }
};
