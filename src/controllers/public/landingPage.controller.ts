import { Request, Response } from 'express';
import * as landingPageService from '../../services/public/landingPage.services.js';

// GET /api/v1/public/landing-page
export const getLandingPage = async (req: Request, res: Response) => {
  try {
    const data = await landingPageService.getLandingPageData();
    res.status(200).json({
      success: true,
      message: 'Landing page data retrieved successfully',
      data,
    });
  } catch (error) {
    console.error('Error retrieving landing page data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve landing page data',
    });
  }
};

// POST /api/v1/public/contact
export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    // For now, just log the contact form (you can add email sending or DB storage later)
    console.log('Contact form submitted:', { name, email, message });
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
    });
  }
};