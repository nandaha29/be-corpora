import { Request, Response } from 'express';
import * as searchService from '../../services/public/search.service.js';
import { SearchQuerySchema } from '../../lib/public.validator.js';
import { z } from 'zod';

// Global search across all content
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const querySchema = z.object({
      q: z.string().min(1, 'Query parameter "q" is required'),
      type: z.string().optional(),
      culture_id: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
      subculture_id: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
      domain_id: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
    });

    const { q: query, type, culture_id, subculture_id, domain_id } = querySchema.parse(req.query);

    const filters: any = {};
    if (type) filters.type = type;
    if (culture_id) filters.culture_id = culture_id;
    if (subculture_id) filters.subculture_id = subculture_id;
    if (domain_id) filters.domain_id = domain_id;

    const results = await searchService.globalSearch(query, filters);

    return res.status(200).json({
      success: true,
      message: 'Search completed successfully',
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
    console.error('Global search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Search failed',
    });
  }
};

// Search specifically in lexicon fields
export const searchLeksikons = async (req: Request, res: Response) => {
  try {
    const { q: query } = SearchQuerySchema.pick({ q: true }).parse(req.query);

    const results = await searchService.searchLeksikons(query);

    return res.status(200).json({
      success: true,
      message: 'Lexicon search completed successfully',
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
    console.error('Lexicon search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lexicon search failed',
    });
  }
};

// Advanced search with multiple parameters
export const advancedSearch = async (req: Request, res: Response) => {
  try {
    const advancedSearchSchema = z.object({
      kata: z.string().optional(),
      makna: z.string().optional(),
      dk_id: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
      culture_id: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
      subculture_id: z.string().optional().transform((v) => v ? parseInt(v) : undefined),
      status: z.string().optional(),
    }).refine((data) => data.kata || data.makna || data.dk_id || data.culture_id || data.subculture_id || data.status, {
      message: 'At least one search parameter is required (kata, makna, dk_id, culture_id, subculture_id, or status)',
    });

    const params = advancedSearchSchema.parse(req.query);

    const results = await searchService.advancedSearch(params);

    let message = 'Advanced search completed successfully';
    let analysis = null;

    if (results.length === 0) {
      analysis = {
        reason: 'No matching lexicons found',
        suggestions: [] as string[]
      };

      // Check if any lexicons exist with the provided kata
      if (params.kata) {
        const kataExists = await searchService.checkLexiconExists({ kata: params.kata });
        if (!kataExists) {
          analysis.suggestions.push(`No lexicons found with kata "${params.kata}"`);
        } else {
          analysis.suggestions.push(`Lexicons with kata "${params.kata}" exist, but filters don't match`);
        }
      }

      // Check domain
      if (params.dk_id) {
        const domainExists = await searchService.checkDomainExists(params.dk_id);
        if (!domainExists) {
          analysis.suggestions.push(`Domain with id ${params.dk_id} does not exist`);
        }
      }

      // Check culture
      if (params.culture_id) {
        const cultureExists = await searchService.checkCultureExists(params.culture_id);
        if (!cultureExists) {
          analysis.suggestions.push(`Culture with id ${params.culture_id} does not exist`);
        }
      }

      // Check status
      if (params.status) {
        analysis.suggestions.push(`Check if lexicons have status "${params.status}"`);
      }

      if (analysis.suggestions.length === 0) {
        analysis.suggestions.push('Try adjusting your search filters');
      }
    }

    return res.status(200).json({
      success: true,
      message,
      data: results,
      ...(analysis && { analysis }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    console.error('Advanced search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Advanced search failed',
    });
  }
};

// Search leksikons within a specific subculture
export const searchLeksikonsInSubculture = async (req: Request, res: Response) => {
  try {
    const subcultureIdParam = req.params.subculture_id;
    const { q: query } = req.query;

    if (!subcultureIdParam) {
      return res.status(400).json({
        success: false,
        message: 'Subculture ID is required',
      });
    }

    const subcultureId = parseInt(subcultureIdParam);

    if (isNaN(subcultureId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subculture ID',
      });
    }

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const results = await searchService.searchLeksikonsInSubculture(subcultureId, query);

    return res.status(200).json({
      success: true,
      message: 'Subculture search completed successfully',
      data: results,
    });
  } catch (error) {
    console.error('Subculture search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Subculture search failed',
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Search leksikons within a specific domain
export const searchLeksikonsInDomain = async (req: Request, res: Response) => {
  try {
    const domainIdParam = req.params.dk_id;
    const { q: query } = req.query;

    if (!domainIdParam) {
      return res.status(400).json({
        success: false,
        message: 'Domain ID is required',
      });
    }

    const domainId = parseInt(domainIdParam);

    if (isNaN(domainId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid domain ID',
      });
    }

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const results = await searchService.searchLeksikonsInDomain(domainId, query);

    return res.status(200).json({
      success: true,
      message: 'Domain search completed successfully',
      data: results,
    });
  } catch (error) {
    console.error('Domain search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Domain search failed',
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Search leksikons within a culture hierarchy
export const searchLeksikonsInCulture = async (req: Request, res: Response) => {
  try {
    const cultureIdParam = req.params.culture_id;
    const { q: query } = req.query;

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

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const results = await searchService.searchLeksikonsInCulture(cultureId, query);

    return res.status(200).json({
      success: true,
      message: 'Culture search completed successfully',
      data: results,
    });
  } catch (error) {
    console.error('Culture search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Culture search failed',
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Global search formatted for frontend (peta-budaya page)
export const globalSearchFormatted = async (req: Request, res: Response) => {
  try {
    const { q: query, category = 'all' } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    // Validate category
    const validCategories = ['subculture', 'lexicon', 'all'];
    if (!validCategories.includes(category as string)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: subculture, lexicon, all',
      });
    }

    const results = await searchService.globalSearchFormatted(query, category as 'subculture' | 'lexicon' | 'all');

    return res.status(200).json({
      success: true,
      message: 'Global search completed successfully',
      data: results,
    });
  } catch (error) {
    console.error('Global search formatted error:', error);
    return res.status(500).json({
      success: false,
      message: 'Global search failed',
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Search lexicon with relevance scoring
export const searchLexicon = async (req: Request, res: Response) => {
  try {
    const { query, fields, limit } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    const fieldList = fields ? (fields as string).split(',') : ['term', 'definition', 'etymology'];
    const limitNum = limit ? parseInt(limit as string) : 10;

    const results = await searchService.searchLexiconWithScoring(query, fieldList, limitNum);

    return res.status(200).json({
      success: true,
      message: 'Lexicon search with scoring completed successfully',
      data: results,
    });
  } catch (error) {
    console.error('Lexicon search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lexicon search failed',
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Search cultures
export const searchCultures = async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const result = await searchService.searchCultures(query, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Culture search completed successfully',
      ...result,
    });
  } catch (error) {
    console.error('Culture search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Culture search failed',
      details: error instanceof Error ? error.message : error,
    });
  }
};;