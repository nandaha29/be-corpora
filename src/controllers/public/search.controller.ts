import { Request, Response } from 'express';
import * as searchService from '../../services/public/search.service.js';

// Global search across all content
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q: query, type, culture_id, subculture_id, domain_id } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const filters: any = {};
    if (type) filters.type = type;
    if (culture_id) filters.culture_id = parseInt(culture_id as string);
    if (subculture_id) filters.subculture_id = parseInt(subculture_id as string);
    if (domain_id) filters.domain_id = parseInt(domain_id as string);

    const results = await searchService.globalSearch(query, filters);

    return res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: results,
    });
  } catch (error) {
    console.error('Global search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Search failed',
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Search specifically in lexicon fields
export const searchLeksikons = async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const results = await searchService.searchLeksikons(query);

    return res.status(200).json({
      success: true,
      message: 'Lexicon search completed successfully',
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

// Advanced search with multiple parameters
export const advancedSearch = async (req: Request, res: Response) => {
  try {
    const { kata, makna, dk_id, culture_id, subculture_id, status } = req.query;

    const params: any = {};
    if (kata) params.kata = kata as string;
    if (makna) params.makna = makna as string;
    if (dk_id) params.dk_id = parseInt(dk_id as string);
    if (culture_id) params.culture_id = parseInt(culture_id as string);
    if (subculture_id) params.subculture_id = parseInt(subculture_id as string);
    if (status) params.status = status as string;

    // At least one search parameter is required
    if (!kata && !makna && !dk_id && !culture_id && !subculture_id && !status) {
      return res.status(400).json({
        success: false,
        message: 'At least one search parameter is required (kata, makna, dk_id, culture_id, subculture_id, or status)',
      });
    }

    const results = await searchService.advancedSearch(params);

    return res.status(200).json({
      success: true,
      message: 'Advanced search completed successfully',
      data: results,
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Advanced search failed',
      details: error instanceof Error ? error.message : error,
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