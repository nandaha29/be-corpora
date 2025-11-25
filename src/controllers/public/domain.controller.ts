import { Request, Response } from 'express';
import * as domainService from '../../services/public/domain.service.js';

// Search leksikons within a specific domain
export const searchLeksikonsInDomain = async (req: Request, res: Response) => {
  try {
    const domainIdParam = req.params.domain_id;
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

    const results = await domainService.searchLeksikonsInDomain(domainId, query);

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

// Get domain details
export const getDomainDetail = async (req: Request, res: Response) => {
  try {
    const domainIdParam = req.params.domain_id;

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

    const data = await domainService.getDomainDetail(domainId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Domain detail retrieved successfully',
      data,
    });
  } catch (error) {
    console.error('Domain detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve domain detail',
      details: error instanceof Error ? error.message : error,
    });
  }
};