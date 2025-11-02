import { Request, Response } from 'express';
import * as cultureService from '../../services/public/culture.service.js';

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

    const results = await cultureService.searchLeksikonsInCulture(cultureId, query);

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