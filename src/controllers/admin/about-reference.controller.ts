import { Request, Response } from 'express';
import * as aboutReferenceService from '../../services/admin/about-reference.service.js';
import { createAboutReferenceSchema, updateAboutReferenceSchema } from '../../lib/validators.js';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/**
 * ABOUT REFERENCE CONTROLLER
 * Handles CRUD operations for references displayed on about page
 */

// GET /api/v1/admin/about-references
export const getAllAboutReferences = async (req: Request, res: Response) => {
  try {
    const references = await aboutReferenceService.getAllAboutReferences();
    return res.status(200).json({
      success: true,
      message: 'About references retrieved successfully',
      data: references,
    });
  } catch (error) {
    console.error('Failed to get about references:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve about references',
      details: error
    });
  }
};

// GET /api/v1/admin/about-references/:id
export const getAboutReferenceById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid about reference ID'
      });
    }

    const reference = await aboutReferenceService.getAboutReferenceById(id);
    if (!reference) {
      return res.status(404).json({
        success: false,
        message: 'About reference not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'About reference retrieved successfully',
      data: reference,
    });
  } catch (error) {
    console.error('Failed to get about reference by id:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve about reference',
      details: error
    });
  }
};

// POST /api/v1/admin/about-references
export const createAboutReference = async (req: Request, res: Response) => {
  try {
    const validated = createAboutReferenceSchema.parse(req.body);
    const created = await aboutReferenceService.createAboutReference(validated);

    return res.status(201).location(`/api/v1/admin/about-references/${created.aboutReferenceId}`).json({
      success: true,
      message: 'About reference created successfully',
      data: created,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }

    if ((error as any)?.code === 'REFERENCE_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Referenced reference does not exist'
      });
    }

    console.error('Failed to create about reference:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create about reference',
      details: error
    });
  }
};

// PUT /api/v1/admin/about-references/:id
export const updateAboutReference = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid about reference ID'
      });
    }

    const validated = updateAboutReferenceSchema.parse(req.body);
    const updated = await aboutReferenceService.updateAboutReference(id, validated);

    return res.status(200).json({
      success: true,
      message: 'About reference updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }

    if ((error as any)?.code === 'ABOUT_REFERENCE_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'About reference not found'
      });
    }

    if ((error as any)?.code === 'REFERENCE_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Referenced reference does not exist'
      });
    }

    console.error('Failed to update about reference:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update about reference',
      details: error
    });
  }
};

// DELETE /api/v1/admin/about-references/:id
export const deleteAboutReference = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid about reference ID'
      });
    }

    await aboutReferenceService.deleteAboutReference(id);

    return res.status(200).json({
      success: true,
      message: 'About reference deleted successfully',
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'About reference not found'
      });
    }

    console.error('Failed to delete about reference:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete about reference',
      details: error
    });
  }
};

// PUT /api/v1/admin/about-references/reorder
export const reorderAboutReferences = async (req: Request, res: Response) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: 'Updates must be an array'
      });
    }

    const results = await aboutReferenceService.reorderAboutReferences(updates);

    return res.status(200).json({
      success: true,
      message: 'About references reordered successfully',
      data: results,
    });
  } catch (error) {
    console.error('Failed to reorder about references:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reorder about references',
      details: error
    });
  }
};