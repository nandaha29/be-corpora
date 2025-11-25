import { Request, Response } from 'express';
import * as lexiconService from '../../services/public/lexicon.service.js';
import { PaginationQuerySchema, SearchQuerySchema, SingleResponseSchema, PaginatedResponseSchema, LexiconWithDetailsSchema } from '../../lib/public.validator.js';
import { z } from 'zod';

// GET /api/v1/public/lexicons (all lexicons with filtering)
export const getAllLexicons = async (req: Request, res: Response) => {
  try {
    const querySchema = z.object({
      regionFilter: z.string().optional(),
      searchQuery: z.string().optional(),
      page: z.string().optional().transform((v) => v ? parseInt(v) : 1),
      limit: z.string().optional().transform((v) => v ? parseInt(v) : 10),
    });

    const { regionFilter, searchQuery, page, limit } = querySchema.parse(req.query);

    const data = await lexiconService.getAllLexicons(regionFilter || 'all', searchQuery || '', page, limit);

    return res.status(200).json({
      success: true,
      message: 'All lexicons retrieved successfully',
      ...data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error,
      });
    }
    console.error('Error retrieving all lexicons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lexicons',
    });
  }
};

// GET /api/v1/public/lexicons/:identifier (lexicon detail)
export const getLexiconDetail = async (req: Request, res: Response) => {
  try {
    const identifierSchema = z.string().min(1, "Identifier is required");
    const identifier = identifierSchema.parse(req.params.identifier);

    const data = await lexiconService.getLexiconDetail(identifier);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Lexicon not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lexicon detail retrieved successfully',
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    console.error('Error retrieving lexicon detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lexicon detail', errors: error,
    });
  }
};