import { Request, Response } from 'express';
import * as referenceService from '../../services/public/reference.service.js';
import { SearchQuerySchema, ReferenceSchema } from '../../lib/public.validator.js';
import { z } from 'zod';

// Get all published references
export const getPublishedReferences = async (req: Request, res: Response) => {
  try {
    const references = await referenceService.getPublishedReferences();

    // Validate response data
    const validatedData = z.array(ReferenceSchema).parse(references);

    return res.status(200).json({
      success: true,
      message: 'Published references retrieved successfully',
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    console.error('Get published references error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve published references',
    });
  }
};

// Get published reference by ID
export const getPublishedReferenceById = async (req: Request, res: Response) => {
  try {
    const referenceIdSchema = z.string().transform((v) => {
      const num = parseInt(v);
      if (isNaN(num)) throw new Error('Invalid reference ID');
      return num;
    });
    const referenceId = referenceIdSchema.parse(req.params.reference_id);

    const reference = await referenceService.getPublishedReferenceById(referenceId);

    if (!reference) {
      return res.status(404).json({
        success: false,
        message: 'Published reference not found',
      });
    }

    // Validate response data
    const validatedData = ReferenceSchema.parse(reference);

    return res.status(200).json({
      success: true,
      message: 'Published reference retrieved successfully',
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    console.error('Get published reference by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve published reference',
    });
  }
};

// Search published references
export const searchPublishedReferences = async (req: Request, res: Response) => {
  try {
    const { q: keyword, page, limit } = SearchQuerySchema.parse(req.query);

    const result = await referenceService.searchPublishedReferences(keyword, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Published references search completed successfully',
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
    console.error('Search published references error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search published references',
    });
  }
};