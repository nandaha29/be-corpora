import { Request, Response } from 'express';
import * as assetService from '../../services/admin/asset.service.js';
import { createAssetSchema, updateAssetSchema, CreateAssetInput } from '../../lib/validators.js';
import { put } from '@vercel/blob';
import crypto from 'crypto';

// ✅ Get All / Filter / Paginate
// export const getAllAssets = async (req: Request, res: Response) => {
//   try {
//     const { type, page, limit } = req.query;
//     const assets = await assetService.getAllAssets(
//       type as string,
//       page ? Number(page) : undefined,
//       limit ? Number(limit) : undefined
//     );
//     res.status(200).json({ success: true, data: assets });
//   } catch {
//     res.status(500).json({ message: 'Failed to fetch assets' });
//   }
// };

export const getAllAssetsPaginated = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await assetService.getAllAssetsPaginated(page, limit);
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved all assets',
      ...result, // akan menampilkan data, total, page, totalPages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve assets' });
  }
};

// ✅ Filter assets by type and/or status with pagination and sorting
export const filterAssets = async (req: Request, res: Response) => {
  try {
    const fileType = req.query.fileType as string | undefined;
    const status = req.query.status as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const order = req.query.order as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await assetService.filterAssets({
      fileType,
      status,
      sortBy,
      order,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: 'Assets filtered successfully',
      ...result,
    });
    return;
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ message: 'Failed to filter assets', error: (error as Error).message });
    return;
  }
};

// ✅ Get Asset by ID
export const getAssetById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const asset = await assetService.getAssetById(id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.status(200).json({
      success: true,
      message: 'Asset retrieved successfully',
      data: asset
    });
    return;
  } catch {
    res.status(500).json({ message: 'Failed to fetch asset' });
    return;
  }
};

// ✅ Create / Upload Asset
export const createAsset = async (req: Request, res: Response) => {
  try {
    const metadata = req.body;
    const parsed = createAssetSchema.parse(metadata);

    if (['PHOTO', 'AUDIO'].includes(parsed.fileType)) {
      if (!req.file) {
        return res.status(400).json({ message: 'File is required for PHOTO and AUDIO types' });
      }
      const maxSize = parsed.fileType === 'PHOTO' ? 500 * 1024 : 10 * 1024 * 1024;
      if (req.file.size > maxSize) {
        const sizeText = parsed.fileType === 'PHOTO' ? '500kb' : '10mb';
        return res.status(400).json({ message: `File size must be less than ${sizeText}` });
      }
      const newAsset = await assetService.createAsset(parsed, req.file);
      res.status(201).json({
        success: true,
        message: 'Asset created successfully',
        data: newAsset
      });
      return;
    } else if (['VIDEO', 'MODEL_3D'].includes(parsed.fileType)) {
      if (req.file) {
        return res.status(400).json({ message: 'File not allowed for VIDEO and MODEL_3D types' });
      }
      // URL is ensured by schema
      const newAsset = await assetService.createAssetFromUrl(parsed as CreateAssetInput & { url: string });
      res.status(201).json({
        success: true,
        message: 'Asset created successfully',
        data: newAsset
      });
      return;
    } else {
      return res.status(400).json({ message: 'Invalid asset type' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// ✅ Update Asset
export const updateAsset = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const parsed = updateAssetSchema.parse(req.body);
    let updateData = parsed;

    const asset = await assetService.getAssetById(id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (req.file) {
      if (!['PHOTO', 'AUDIO'].includes(asset.fileType)) {
        return res.status(400).json({ message: 'File upload only allowed for PHOTO and AUDIO types' });
      }
      const maxSize = asset.fileType === 'PHOTO' ? 500 * 1024 : 10 * 1024 * 1024;
      if (req.file.size > maxSize) {
        const sizeText = asset.fileType === 'PHOTO' ? '500kb' : '10mb';
        return res.status(400).json({ message: `File size must be less than ${sizeText}` });
      }
      // Upload new file
      const blob = await put(req.file.originalname, req.file.buffer, { access: 'public' });
      const fileSize = req.file.size.toString();
      const hashChecksum = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
      updateData = { ...parsed, url: blob.url, fileSize, hashChecksum };
    } else if (parsed.url && ['VIDEO', 'MODEL_3D'].includes(asset.fileType)) {
      // Allow updating url for VIDEO and MODEL_3D
    } else if (parsed.url && ['PHOTO', 'AUDIO'].includes(asset.fileType)) {
      return res.status(400).json({ message: 'Cannot update URL for PHOTO and AUDIO types' });
    }

    const updated = await assetService.updateAsset(id, updateData);
    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: updated,
    });
    return;
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// ✅ Delete Asset
export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await assetService.deleteAsset(id);
    res.status(200).json({ success: true, message: 'Asset deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Failed to delete asset' });
  }
};

// ✅ Get public asset file (only if status = 'PUBLISHED')
export const getPublicAssetFile = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const asset = await assetService.getPublicAssetFile(id);
    if (!asset) return res.status(404).json({ message: 'File not found or not published' });
    res.status(200).json({
      success: true,
      message: 'Public asset file retrieved successfully',
      data: asset
    });
    return;
  } catch {
    res.status(500).json({ message: 'Failed to access public file' });
    return;
  }
};


// ✅ Bulk Upload
export const bulkUploadAssets = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const assets = req.body;

    if (!Array.isArray(assets) || !Array.isArray(files)) {
      return res.status(400).json({ message: 'Request body must be an array of assets and files must be provided' });
    }

    if (assets.length !== files.length) {
      return res.status(400).json({ message: 'Number of assets and files must match' });
    }

    // Check that all assets are FOTO or AUDIO
    for (const asset of assets) {
      if (!['PHOTO', 'AUDIO'].includes(asset.fileType)) {
        return res.status(400).json({ message: 'Bulk upload only supports PHOTO and AUDIO types' });
      }
    }

    // Check file sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) {
        return res.status(400).json({ message: `File ${i + 1} is missing` });
      }
      const asset = assets[i];
      const maxSize = asset.fileType === 'PHOTO' ? 500 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        const sizeText = asset.fileType === 'PHOTO' ? '500kb' : '10mb';
        return res.status(400).json({ message: `File ${i + 1} size must be less than ${sizeText}` });
      }
    }

    const result = await assetService.bulkUploadAssets(assets, files);
    res.status(201).json({ success: true, data: result });
    return;
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};

// SEARCH assets
export const searchAssets = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query parameter q is required',
      });
    }

    const result = await assetService.searchAssets(q.trim(), page, limit);
    res.status(200).json({
      success: true,
      message: 'Assets searched successfully',
      ...result,
    });
    return;
  } catch (error) {
    console.error('Error searching assets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search assets',
      error: (error as Error).message,
    });
    return;
  }
};
