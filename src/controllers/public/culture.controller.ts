import { Request, Response } from 'express';
import * as cultureService from '../../services/public/culture.service.js';
import { PaginationQuerySchema, SingleResponseSchema, PaginatedResponseSchema } from '../../lib/public.validator.js';
import { z } from 'zod';

// Get all published cultures
export const getAllCultures = async (req: Request, res: Response) => {
  try {
    const { page, limit } = PaginationQuerySchema.parse(req.query);

    const result = await cultureService.getAllPublishedCultures(page, limit);

    return res.status(200).json({
      success: true,
      message: 'Cultures retrieved successfully',
      ...result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    console.error('Get all cultures error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve cultures',
    });
  }
};

// Search leksikons within a culture hierarchy
export const searchLeksikonsInCulture = async (req: Request, res: Response) => {
  try {
    const cultureIdSchema = z.string().transform((v) => {
      const num = parseInt(v);
      if (isNaN(num)) throw new Error('Invalid culture ID');
      return num;
    });
    const cultureId = cultureIdSchema.parse(req.params.culture_id);

    const querySchema = z.object({
      q: z.string().min(1, 'Query parameter "q" is required'),
      page: z.string().optional().transform((v) => v ? parseInt(v) : 1),
      limit: z.string().optional().transform((v) => v ? parseInt(v) : 10),
    });
    const { q: query, page, limit } = querySchema.parse(req.query);

    const results = await cultureService.searchLeksikonsInCulture(cultureId, query, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Culture search completed successfully',
      data: results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    console.error('Culture search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Culture search failed',
    });
  }
};

// Get culture details
export const getCultureDetail = async (req: Request, res: Response) => {
  try {
    const cultureIdParam = req.params.culture_id;

    if (!cultureIdParam) {
      return res.status(400).json({
        success: false,
        message: 'Culture ID is required',
      });
    }

    const cultureId = parseInt(cultureIdParam);

    if (isNaN(cultureId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid culture ID',
      });
    }

    const data = await cultureService.getCultureDetail(cultureId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Culture not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Culture detail retrieved successfully',
      data,
    });
  } catch (error) {
    console.error('Culture detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve culture detail',
      details: error instanceof Error ? error.message : error,
    });
  }
};