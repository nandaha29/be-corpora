import { Request, Response } from 'express';
import * as subcultureService from '../../services/public/subculture.service.js';

// GET /api/public/subcultures (gallery)
export const getSubculturesGallery = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q as string || '';

    const data = await subcultureService.getSubculturesGallery(searchQuery);

    return res.status(200).json({
      success: true,
      message: 'Subcultures gallery retrieved successfully',
      data,
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

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required',
      });
    }

    const data = await subcultureService.getSubcultureDetail(identifier);
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

// GET /api/public/subcultures/:identifier/search?query=...
export const searchLexicon = async (req: Request, res: Response) => {
  try {
    const identifier = req.params.identifier;
    const query = req.query.query as string;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required',
      });
    }

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    const results = await subcultureService.searchLexicon(identifier, query.trim());

    return res.status(200).json({
      success: true,
      message: 'Search results retrieved successfully',
      data: results,
    });
  } catch (error) {
    console.error('Error searching lexicon:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search lexicon',
    });
  }
};