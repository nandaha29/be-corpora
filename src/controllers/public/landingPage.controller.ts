import { Request, Response } from 'express';
import * as landingPageService from '../../services/public/landingPage.services.js';
import { ContactFormSchema } from '../../lib/public.validator.js';
import { z } from 'zod';

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
      message: 'Failed to retrieve landing page data', error: error,
    });
  }
};

// POST /api/v1/public/contact
export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const validatedData = ContactFormSchema.parse(req.body);

    // For now, just log the contact form (you can add email sending or DB storage later)
    console.log('Contact form submitted:', validatedData);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
    });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
    });
  }
};