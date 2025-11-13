// import { Request, Response } from 'express';
// import * as culturalItemsService from '../../services/public/culturalItems.service.js';

// // GET /api/v1/public/cultural-items?search={query}&category={category}&page={page}&limit={limit}
// export const getCulturalItems = async (req: Request, res: Response) => {
//   try {
//     const searchQuery = req.query.search as string || '';
//     const category = req.query.category as string || 'all';
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;

//     const data = await culturalItemsService.getCulturalItems(searchQuery, category, page, limit);

//     return res.status(200).json({
//       success: true,
//       message: 'Cultural items retrieved successfully',
//       data: data.items,
//       pagination: {
//         total: data.total,
//         page: data.page,
//         limit: data.limit,
//         totalPages: Math.ceil(data.total / data.limit),
//       },
//     });
//   } catch (error) {
//     console.error('Error retrieving cultural items:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to retrieve cultural items',
//     });
//   }
// };