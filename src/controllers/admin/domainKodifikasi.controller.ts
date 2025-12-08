import { Request, Response } from 'express';
import * as domainService from '../../services/admin/domainKodifikasi.service.js';
import {
  createCodificationDomainSchema,
  updateCodificationDomainSchema,
} from '../../lib/validators.js';
import { ZodError } from 'zod';

// GET /api/domains
export const getDomains = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await domainService.getAllDomainKodifikasi(page, limit);

    res.status(200).json({
      success: true,
      message: 'Domains retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
    return;
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve domain kodifikasi" 
    });
    return;
  }
};

// GET /api/domains/:id
export const getDomainById = async (req: Request, res: Response) => {
  // console.log('📋 GET DOMAIN BY ID CONTROLLER CALLED with params:', req.params);
  try {
    const { id } = req.params;
    const item = await domainService.getDomainKodifikasiById(Number(id));
    if (!item) return res.status(404).json({ 
      success: false,
      message: 'Domain not found' 
    });
    res.status(200).json({
      success: true,
      message: 'Domain retrieved successfully',
      data: item,
    });
    return;
  } catch (error) {
    // console.error('❌ GET DOMAIN BY ID ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve domain', 
      errors: error 
    });
    return;
  }
};

// POST /api/domains
export const createDomain = async (req: Request, res: Response) => {
  try {
    const validated = createCodificationDomainSchema.parse(req.body);
    const created = await domainService.createDomainKodifikasi(validated);
    res.status(201).json({
      success: true,
      message: 'Domain created successfully',
      data: created,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors: error 
      });
    }
    if (error instanceof Error && error.message === 'Subculture not found') {
      return res.status(400).json({ 
        success: false,
        message: 'Referenced subculture does not exist' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to create domain' 
    });
    return;
  }
};

// PUT /api/domains/:id
export const updateDomain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = updateCodificationDomainSchema.parse(req.body);
    const updated = await domainService.updateDomainKodifikasi(Number(id), validated);
    res.status(200).json({
      success: true,
      message: 'Domain updated successfully',
      data: updated,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed', 
        errors: error 
      });
    }
    if (error instanceof Error && error.message === 'Subculture not found') {
      return res.status(400).json({ 
        success: false,
        message: 'Referenced subculture does not exist' 
      });
    }
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ 
        success: false,
        message: 'Domain not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to update domain' 
    });
    return;
  }
};

// DELETE /api/domains/:id
export const deleteDomain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await domainService.deleteDomainKodifikasi(Number(id));
    res.status(200).json({
      success: true,
      message: 'Domain deleted successfully',
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return res.status(404).json({ 
        success: false,
        message: 'Domain not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete domain' 
    });
    return;
  }
};

// GET /api/admin/domain-kodifikasi/filter - Filter by code and/or status with pagination
export const filterDomainKodifikasis = async (req: Request, res: Response) => {
  // console.log('🔍 FILTER CONTROLLER CALLED with query:', req.query);
  try {
    const code = req.query.code as string | undefined;
    const status = req.query.status as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    // console.log('Parsed filters:', { code, status, page, limit });

    const result = await domainService.filterDomainKodifikasis({
      code,
      status,
      page,
      limit,
    });

    console.log('Filter result:', result);
    res.status(200).json({
      success: true,
      message: 'Domain kodifikasi filtered successfully',
      data: result.data,
      pagination: result.meta,
    });
    return;
  } catch (error) {
    // console.error('❌ FILTER CONTROLLER ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to filter domain kodifikasi", 
      error: (error as Error).message 
    });
    return;
  }
};

// GET /api/admin/domain-kodifikasi/search - Search by query across code, domainName, and explanation
export const searchDomainKodifikasis = async (req: Request, res: Response) => {
  // console.log('🔍 SEARCH CONTROLLER CALLED with query:', req.query);
  try {
    const query = req.query.q as string;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Search query is required' 
      });
    }

    console.log('Parsed search:', { query: query.trim(), page, limit });

    const result = await domainService.searchDomainKodifikasis(query.trim(), page, limit);

    console.log('Search result:', result);
    res.status(200).json({
      success: true,
      message: 'Domain kodifikasi searched successfully',
      data: result.data,
      pagination: result.meta,
    });
    return;
  } catch (error) {
    // console.error('❌ SEARCH CONTROLLER ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to search domain kodifikasi", 
      error: (error as Error).message 
    });
    return;
  }
};