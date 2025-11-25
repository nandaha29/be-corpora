import { Request, Response } from "express";
import * as referenceService from "../../services/admin/reference.service.js";
import { createReferenceSchema, updateReferenceSchema } from "../../lib/validators.js";
import { ZodError } from "zod";

// Get All
// export const getReferences = async (_req: Request, res: Response) => {
//   try {
//     const references = await referenceService.getAllReferences();
//     res.status(200).json({
//       message: "Success",
//       data: references,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve references" });
//   }
// };

// Get by ID
export const getReferenceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reference = await referenceService.getReferenceById(Number(id));

    if (!reference) {
      return res.status(404).json({ message: "Reference not found" });
    }

    res.status(200).json({
      success: true,
      message: "Reference retrieved successfully",
      data: reference,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reference" });
    return;
  }
};

// Create
export const createReference = async (req: Request, res: Response) => {
  try {
    const validatedData = createReferenceSchema.parse(req.body);
    const newReference = await referenceService.createReference(validatedData);

    res.status(201).json({
      success: true,
      message: "Reference created successfully",
      data: newReference,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    // console.error('Create reference error:', error);
    res.status(500).json({ message: "Failed to create reference", error:error});
    return;
  }
};

// Update
export const updateReference = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateReferenceSchema.parse(req.body);
    const updatedReference = await referenceService.updateReference(Number(id), validatedData);

    res.status(200).json({
      success: true,
      message: "Reference updated successfully",
      data: updatedReference,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return res.status(404).json({ message: "Reference not found" });
    }

    res.status(500).json({ message: "Failed to update reference" });
    return;
  }
};

// Delete
export const deleteReference = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await referenceService.deleteReference(Number(id));

    res.status(200).json({
      success: true,
      message: "Reference deleted successfully"
    });
    return;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to delete not found")) {
      return res.status(404).json({ message: "Reference not found" });
    }

    res.status(500).json({ message: "Failed to delete reference" });
    return;
  }
};

// ✅ GET (pagination + filter)
export const getAllReferensiPaginated = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await referenceService.getAllReferensiPaginated(page, limit);
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved all referensi',
      ...result, // akan menampilkan data, total, page, totalPages
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve referensi' });
    return;
  }
};

// ✅ GET public references - BELUM UPDATE SCHEMA
// export const getPublicReferensi = async (req: Request, res: Response) => {
//   try {
//     const result = await referenceService.getPublicReferensi();
//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve public referensi' });
//   }
// };

// ✅ SEARCH references
export const searchReferensi = async (req: Request, res: Response) => {
  try {
    const keyword = String(req.query.q || '');
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!keyword) return res.status(400).json({ message: 'Query parameter "q" is required' });

    const result = await referenceService.searchReferensi(keyword, page, limit);

    res.status(200).json({
      success: true,
      message: `Found references matching "${keyword}"`,
      ...result,
    });
    return;

  } catch (error) {
    res.status(500).json({ message: 'Failed to search references', error: (error as Error).message });
    return;
  }
};

// ✅ FILTER references by type, year, status, createdAt
export const filterReferences = async (req: Request, res: Response) => {
  try {
    const referenceType = req.query.referenceType as string | undefined;
    const publicationYear = req.query.publicationYear as string | undefined;
    const status = req.query.status as string | undefined;
    const createdAtFrom = req.query.createdAtFrom as string | undefined;
    const createdAtTo = req.query.createdAtTo as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await referenceService.filterReferences({
      referenceType,
      publicationYear,
      status,
      createdAtFrom,
      createdAtTo,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'References filtered successfully',
      ...result,
    });
    return;
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ message: 'Failed to filter references', error: (error as Error).message });
    return;
  }
};
