import { Request, Response } from 'express';
import * as lexiconService from '../../services/public/lexicon.service.js';

// GET /api/v1/public/lexicons (all lexicons with filtering)
export const getAllLexicons = async (req: Request, res: Response) => {
  try {
    const region = req.query.region as string || 'all';
    const searchQuery = req.query.q as string || '';

    const data = await lexiconService.getAllLexicons(region, searchQuery);

    return res.status(200).json({
      success: true,
      message: 'All lexicons retrieved successfully',
      data,
    });
  } catch (error) {
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
    const identifier = req.params.identifier;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required',
      });
    }

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
    console.error('Error retrieving lexicon detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lexicon detail',
    });
  }
};