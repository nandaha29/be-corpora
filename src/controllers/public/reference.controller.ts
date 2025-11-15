import { Request, Response } from 'express';
import * as referenceService from '../../services/public/reference.service.js';

// Get all published references
export const getPublishedReferences = async (req: Request, res: Response) => {
  try {
    const references = await referenceService.getPublishedReferences();

    return res.status(200).json({
      success: true,
      message: 'Published references retrieved successfully',
      data: references,
    });
  } catch (error) {
    console.error('Get published references error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve published references',
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Get published reference by ID
export const getPublishedReferenceById = async (req: Request, res: Response) => {
  try {
    const referensiIdParam = req.params.referensi_id;

    if (!referensiIdParam) {
      return res.status(400).json({
        success: false,
        message: 'Reference ID is required',
      });
    }

    const referensiId = parseInt(referensiIdParam);

    if (isNaN(referensiId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference ID',
      });
    }

    const reference = await referenceService.getPublishedReferenceById(referensiId);

    if (!reference) {
      return res.status(404).json({
        success: false,
        message: 'Published reference not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Published reference retrieved successfully',
      data: reference,
    });
  } catch (error) {
    console.error('Get published reference by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve published reference',
      details: error instanceof Error ? error.message : error,
    });
  }
};