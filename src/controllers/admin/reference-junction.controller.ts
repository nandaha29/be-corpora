import { Request, Response } from "express";
import * as referenceJunctionService from "../../services/admin/reference-junction.service.js";
import {
  createLexiconReferenceSchema,
  createSubcultureReferenceSchema,
  createCultureReferenceSchema
} from "../../lib/validators.js";
import { ZodError } from "zod";

/**
 * REFERENCE JUNCTION CONTROLLER
 * Handles reference assignments to different entities
 */

// ============================================
// LEXICON REFERENCE ASSIGNMENTS
// ============================================

export const assignReferenceToLexicon = async (req: Request, res: Response) => {
  try {
    const validatedData = createLexiconReferenceSchema.parse(req.body);
    const result = await referenceJunctionService.assignReferenceToLexicon(validatedData);

    res.status(201).json({
      success: true,
      message: "Reference assigned to lexicon successfully",
      data: result,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes("already assigned")) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
    }

    console.error('Assign reference to lexicon error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to assign reference to lexicon",
      error: error
    });
    return;
  }
};

export const removeReferenceFromLexicon = async (req: Request, res: Response) => {
  try {
    const { lexiconId, referenceId } = req.params;
    await referenceJunctionService.removeReferenceFromLexicon(
      Number(lexiconId),
      Number(referenceId)
    );

    res.status(200).json({
      success: true,
      message: "Reference removed from lexicon successfully"
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error('Remove reference from lexicon error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to remove reference from lexicon",
      error: error
    });
    return;
  }
};

export const getReferencesByLexicon = async (req: Request, res: Response) => {
  try {
    const { lexiconId } = req.params;
    const references = await referenceJunctionService.getReferencesByLexicon(Number(lexiconId));

    res.status(200).json({
      success: true,
      message: "References retrieved successfully",
      data: references,
    });
    return;
  } catch (error) {
    console.error('Get references by lexicon error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve references",
      error: error
    });
    return;
  }
};

// ============================================
// SUBCULTURE REFERENCE ASSIGNMENTS
// ============================================

export const assignReferenceToSubculture = async (req: Request, res: Response) => {
  try {
    const validatedData = createSubcultureReferenceSchema.parse(req.body);
    const result = await referenceJunctionService.assignReferenceToSubculture(validatedData);

    res.status(201).json({
      success: true,
      message: "Reference assigned to subculture successfully",
      data: result,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes("already assigned")) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
    }

    console.error('Assign reference to subculture error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to assign reference to subculture",
      error: error
    });
    return;
  }
};

export const removeReferenceFromSubculture = async (req: Request, res: Response) => {
  try {
    const { subcultureId, referenceId } = req.params;
    await referenceJunctionService.removeReferenceFromSubculture(
      Number(subcultureId),
      Number(referenceId)
    );

    res.status(200).json({
      success: true,
      message: "Reference removed from subculture successfully"
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error('Remove reference from subculture error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to remove reference from subculture",
      error: error
    });
    return;
  }
};

export const getReferencesBySubculture = async (req: Request, res: Response) => {
  try {
    const { subcultureId } = req.params;
    const references = await referenceJunctionService.getReferencesBySubculture(Number(subcultureId));

    res.status(200).json({
      success: true,
      message: "References retrieved successfully",
      data: references,
    });
    return;
  } catch (error) {
    console.error('Get references by subculture error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve references",
      error: error
    });
    return;
  }
};

// ============================================
// CULTURE REFERENCE ASSIGNMENTS
// ============================================

export const assignReferenceToCulture = async (req: Request, res: Response) => {
  try {
    const validatedData = createCultureReferenceSchema.parse(req.body);
    const result = await referenceJunctionService.assignReferenceToCulture(validatedData);

    res.status(201).json({
      success: true,
      message: "Reference assigned to culture successfully",
      data: result,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes("already assigned")) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
    }

    console.error('Assign reference to culture error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to assign reference to culture",
      error: error
    });
    return;
  }
};

export const removeReferenceFromCulture = async (req: Request, res: Response) => {
  try {
    const { cultureId, referenceId } = req.params;
    await referenceJunctionService.removeReferenceFromCulture(
      Number(cultureId),
      Number(referenceId)
    );

    res.status(200).json({
      success: true,
      message: "Reference removed from culture successfully"
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error('Remove reference from culture error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to remove reference from culture",
      error: error
    });
    return;
  }
};

export const getReferencesByCulture = async (req: Request, res: Response) => {
  try {
    const { cultureId } = req.params;
    const references = await referenceJunctionService.getReferencesByCulture(Number(cultureId));

    res.status(200).json({
      success: true,
      message: "References retrieved successfully",
      data: references,
    });
    return;
  } catch (error) {
    console.error('Get references by culture error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve references",
      error: error
    });
    return;
  }
};

// ============================================
// REFERENCE USAGE STATISTICS
// ============================================

export const getReferenceUsageStats = async (req: Request, res: Response) => {
  try {
    const { referenceId } = req.params;
    const stats = await referenceJunctionService.getReferenceUsageStats(Number(referenceId));

    res.status(200).json({
      success: true,
      message: "Reference usage statistics retrieved successfully",
      data: stats,
    });
    return;
  } catch (error) {
    console.error('Get reference usage stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve reference usage statistics",
      error: error
    });
    return;
  }
};