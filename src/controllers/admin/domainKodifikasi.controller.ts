import { Request, Response } from 'express';
import * as domainService from '../../services/admin/domainKodifikasi.service.js';
import {
  createDomainKodifikasiSchema,
  updateDomainKodifikasiSchema,
} from '../../lib/validators.js';
import { ZodError } from 'zod';

// GET /api/domains
export const getDomains = async (req: Request, res: Response) => {
  try {
    const domainKodifikasi = await domainService.getAllDomainKodifikasi();

    res.status(200).json({
      message: "Success",
      data: domainKodifikasi,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve domain kodifikasi" });
    return;
  }
};

// GET /api/domains/:id
export const getDomainById = async (req: Request, res: Response) => {
  // console.log('📋 GET DOMAIN BY ID CONTROLLER CALLED with params:', req.params);
  try {
    const { id } = req.params;
    const item = await domainService.getDomainKodifikasiById(Number(id));
    if (!item) return res.status(404).json({ message: 'Domain not found' });
    res.status(200).json(item);
    return;
  } catch (error) {
    // console.error('❌ GET DOMAIN BY ID ERROR:', error);
    res.status(500).json({ message: 'Failed to retrieve domain', errors: error });
    return;
  }
};

// POST /api/domains
export const createDomain = async (req: Request, res: Response) => {
  try {
    const validated = createDomainKodifikasiSchema.parse(req.body);
    const created = await domainService.createDomainKodifikasi(validated);
    res.status(201).json(created);
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error });
    }
    if (error instanceof Error && error.message === 'Subculture not found') {
      return res.status(400).json({ message: 'Referenced subculture does not exist' });
    }
    res.status(500).json({ message: 'Failed to create domain' });
    return;
  }
};

// PUT /api/domains/:id
export const updateDomain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = updateDomainKodifikasiSchema.parse(req.body);
    const updated = await domainService.updateDomainKodifikasi(Number(id), validated);
    res.status(200).json(updated);
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error });
    }
    if (error instanceof Error && error.message === 'Subculture not found') {
      return res.status(400).json({ message: 'Referenced subculture does not exist' });
    }
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({ message: 'Domain not found' });
    }
    res.status(500).json({ message: 'Failed to update domain' });
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
      return res.status(404).json({ message: 'Domain not found' });
    }
    res.status(500).json({ message: 'Failed to delete domain' });
    return;
  }
};

// GET /api/admin/domain-kodifikasi/filter - Filter by kode and/or status with pagination
export const filterDomainKodifikasis = async (req: Request, res: Response) => {
  // console.log('🔍 FILTER CONTROLLER CALLED with query:', req.query);
  try {
    const kode = req.query.kode as string | undefined;
    const status = req.query.status as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    // console.log('Parsed filters:', { kode, status, page, limit });

    const result = await domainService.filterDomainKodifikasis({
      kode,
      status,
      page,
      limit,
    });

    console.log('Filter result:', result);
    res.status(200).json(result);
    return;
  } catch (error) {
    // console.error('❌ FILTER CONTROLLER ERROR:', error);
    res.status(500).json({ message: "Failed to filter domain kodifikasi", error: (error as Error).message });
    return;
  }
};

// GET /api/admin/domain-kodifikasi/search - Search by query across kode, namaDomain, and penjelasan
export const searchDomainKodifikasis = async (req: Request, res: Response) => {
  // console.log('🔍 SEARCH CONTROLLER CALLED with query:', req.query);
  try {
    const query = req.query.q as string;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    console.log('Parsed search:', { query: query.trim(), page, limit });

    const result = await domainService.searchDomainKodifikasis(query.trim(), page, limit);

    console.log('Search result:', result);
    res.status(200).json(result);
    return;
  } catch (error) {
    // console.error('❌ SEARCH CONTROLLER ERROR:', error);
    res.status(500).json({ message: "Failed to search domain kodifikasi", error: (error as Error).message });
    return;
  }
};