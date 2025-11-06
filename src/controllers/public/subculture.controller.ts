import { Request, Response } from 'express';
import * as subcultureService from '../../services/public/subculture.service.js';
import * as searchController from './search.controller.js';

// GET /api/public/subcultures (gallery)
export const getSubculturesGallery = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search as string || '';
    const category = req.query.category as string || 'all';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await subcultureService.getSubculturesGallery(searchQuery, category, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Subcultures gallery retrieved successfully',
      data: data.subcultures,
      pagination: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: Math.ceil(data.total / data.limit),
      },
    });
  } catch (error) {
    console.error('Error retrieving subcultures gallery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subcultures gallery',
    });
  }
};

// GET /api/public/subcultures/:identifier (slug or ID)
export const getSubcultureDetail = async (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier;
    const searchQuery = req.query.search as string;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required',
      });
    }

    const data = await subcultureService.getSubcultureDetail(identifier, searchQuery);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Subculture not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subculture detail retrieved successfully',
      data,
    });
  } catch (error) {
    console.error('Error retrieving subculture detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subculture detail',
    });
  }
};

// GET /api/public/subcultures/:identifier/lexicon?search=...&page=...&limit=...
export const getSubcultureLexicons = async (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier;
    const searchQuery = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required',
      });
    }

    const results = await subcultureService.getSubcultureLexicons(identifier, searchQuery, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Subculture lexicons retrieved successfully',
      data: results,
    });
  } catch (error) {
    console.error('Error retrieving subculture lexicons:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subculture lexicons',
    });
  }
};

// Search leksikons within a specific subculture
export const searchLeksikonsInSubculture = searchController.searchLeksikonsInSubculture;