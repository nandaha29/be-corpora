import { Request, Response } from 'express';
import * as subcultureService from '../../services/public/subculture.service.js';
import { prisma } from '../../lib/prisma.js';

// GET /api/v1/public/regions/:regionId - Get region data for map popup (subculture or culture)
export const getRegionData = async (req: Request, res: Response) => {
  try {
    const { regionId } = req.params;

    if (!regionId) {
      return res.status(400).json({
        success: false,
        message: 'Region ID is required',
      });
    }

    let regionData: any = null;
    let regionType: 'subculture' | 'culture' = 'subculture';

    // First, try to fetch as subculture
    const subcultureData = await subcultureService.getSubcultureDetail(regionId);

    if (subcultureData) {
      // Format subculture data
      regionData = {
        id: subcultureData.subcultureId,
        name: subcultureData.profile?.displayName || 'Unknown Subculture',
        description: subcultureData.profile?.history || 'No description available',
        salamKhas: subcultureData.profile?.salamKhas || null,
        culture: subcultureData.culture,
        heroImage: subcultureData.heroImage,
        galleryImages: subcultureData.galleryImages?.slice(0, 3) || [],
        lexiconCount: subcultureData.lexicon?.length || 0,
        highlights: subcultureData.profile?.highlights || [],
        type: 'subculture',
      };
    } else {
      // If not found as subculture, try as culture
      // Try multiple slug variations for culture
      const possibleSlugs = [regionId, regionId.replace('-', ' '), regionId.replace('-', '-').toLowerCase()];
      
      let culture = null;
      for (const slug of possibleSlugs) {
        culture = await prisma.culture.findUnique({
          where: { slug: slug, status: { in: ['DRAFT', 'PUBLISHED'] } },
          include: {
            subcultures: {
              where: { status: { in: ['DRAFT', 'PUBLISHED'] } },
              include: {
                culture: true,
              },
            },
            cultureAssets: {
              include: { asset: true },
              where: {
                asset: { fileType: 'PHOTO', status: 'ACTIVE' },
                assetRole: 'THUMBNAIL',
              },
            },
          },
        });
        if (culture) break;
      }

      // If not found by slug variations, try by ID
      if (!culture) {
        const id = Number(regionId);
        if (!isNaN(id)) {
          culture = await prisma.culture.findUnique({
            where: { cultureId: id, status: { in: ['DRAFT', 'PUBLISHED'] } },
            include: {
              subcultures: {
                where: { status: { in: ['DRAFT', 'PUBLISHED'] } },
                include: {
                  culture: true,
                },
              },
              cultureAssets: {
                include: { asset: true },
                where: {
                  asset: { fileType: 'PHOTO', status: 'ACTIVE' },
                  assetRole: 'THUMBNAIL',
                },
              },
            },
          });
        }
      }

      // If still not found, try find by name contains
      if (!culture) {
        const nameQuery = regionId.replace('-', ' ');
        culture = await prisma.culture.findFirst({
          where: { 
            cultureName: { contains: nameQuery, mode: 'insensitive' },
            status: { in: ['DRAFT', 'PUBLISHED'] }
          },
          include: {
            subcultures: {
              where: { status: { in: ['DRAFT', 'PUBLISHED'] } },
              include: {
                culture: true,
              },
            },
            cultureAssets: {
              include: { asset: true },
              where: {
                asset: { fileType: 'PHOTO', status: 'ACTIVE' },
                assetRole: 'THUMBNAIL',
              },
            },
          },
        });
      }

      if (culture) {
        regionType = 'culture';
        // Format culture data
        regionData = {
          id: culture.cultureId,
          name: culture.cultureName || 'Unknown Culture',
          description: culture.characteristics || culture.originIsland || 'No description available',
          salamKhas: null, // Culture doesn't have salam khas
          culture: {
            name: culture.cultureName,
            province: culture.province,
          },
          heroImage: culture.cultureAssets?.[0]?.asset?.url || null,
          galleryImages: culture.cultureAssets?.slice(0, 3).map(ca => ca.asset?.url).filter(Boolean) || [],
          lexiconCount: 0, // Culture doesn't have direct lexicons
          highlights: [], // Could add some highlights if needed
          type: 'culture',
          subcultureCount: culture.subcultures.length,
        };
      }
    }

    if (!regionData) {
      return res.status(404).json({
        success: false,
        message: 'Region not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Region data retrieved successfully',
      data: regionData,
    });
  } catch (error) {
    console.error('Error retrieving region data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve region data',
    });
  }
};