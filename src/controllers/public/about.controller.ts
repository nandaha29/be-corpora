import { Request, Response } from 'express';
import { getAboutPageData } from '../../services/public/about.service.js';

export const getAboutPage = async (req: Request, res: Response) => {
  try {
    const data = await getAboutPageData();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching about page data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};