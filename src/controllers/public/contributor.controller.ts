import { Request, Response } from 'express';
import * as contributorService from '../../services/public/contributor.service.js';
import { PaginationQuerySchema, SearchQuerySchema, ContributorWithAssetsSchema } from '../../lib/public.validator.js';
import { z } from 'zod';

// Get all published contributors (active coordinators)
export const getPublishedContributors = async (req: Request, res: Response) => {
  try {
    const { page, limit } = PaginationQuerySchema.parse(req.query);

    const result = await contributorService.getPublishedContributors(page, limit);

    return res.status(200).json({
      success: true,
      message: 'Published contributors retrieved successfully',
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
    console.error('Get published contributors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve published contributors',
    });
  }
};

// Get published contributor by ID
export const getPublishedContributorById = async (req: Request, res: Response) => {
  try {
    const contributorIdSchema = z.string().transform((v) => {
      const num = parseInt(v);
      if (isNaN(num)) throw new Error('Invalid contributor ID');
      return num;
    });
    const contributorId = contributorIdSchema.parse(req.params.contributor_id);

    const contributor = await contributorService.getPublishedContributorById(contributorId);

    if (!contributor) {
      return res.status(404).json({
        success: false,
        message: 'Published contributor not found',
      });
    }

    // Validate response data
    const validatedData = ContributorWithAssetsSchema.parse(contributor);

    return res.status(200).json({
      success: true,
      message: 'Published contributor retrieved successfully',
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
    console.error('Get published contributor by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve published contributor',
    });
  }
};

// Search published contributors
export const searchPublishedContributors = async (req: Request, res: Response) => {
  try {
    const { q: keyword, page, limit } = SearchQuerySchema.parse(req.query);

    const result = await contributorService.searchPublishedContributors(keyword, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Published contributors search completed successfully',
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
    console.error('Search published contributors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search published contributors',
    });
  }
};