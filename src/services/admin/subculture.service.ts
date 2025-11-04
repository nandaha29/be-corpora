import { Prisma, PrismaClient, SubcultureAssetRole } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateSubcultureInput, UpdateSubcultureInput } from "../../lib/validators.js";

const prisma = new PrismaClient();

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing dashes
};

export const getAllSubcultures = async () => {
  return prisma.subculture.findMany({
    include: {
      culture: true,
      domainKodifikasis: true,
      subcultureAssets: {
        include: { asset: true },
      },
    },
  });
};

export const getSubcultureById = async (id: number) => {
  return prisma.subculture.findUnique({
    where: { subcultureId: id },
    include: {
      culture: true,
      domainKodifikasis: true,
      subcultureAssets: {
        include: { asset: true },
      },
    },
  });
};

export const createSubculture = async (data: any) => {
  const slug = generateSlug(data.namaSubculture);
  return prisma.subculture.create({ 
    data: {
      ...data,
      slug,
    }
  });
};

export const updateSubculture = async (id: number, data: any) => {
  let updateData = data;
  if (data.namaSubculture) {
    updateData.slug = generateSlug(data.namaSubculture);
  }
  return prisma.subculture.update({
    where: { subcultureId: id },
    data: updateData,
  });
};

export const deleteSubculture = async (id: number) => {
  return prisma.subculture.delete({
    where: { subcultureId: id },
  });
};

export const addAssetToSubculture = async (subcultureId: number, assetId: number, assetRole: SubcultureAssetRole) => {
  // verify subculture exists
  const subculture = await prisma.subculture.findUnique({ where: { subcultureId } });
  if (!subculture) {
    const err = new Error('Subculture not found');
    (err as any).code = 'SUBCULTURE_NOT_FOUND';
    throw err;
  }

  // verify asset exists
  const asset = await prisma.asset.findUnique({ where: { assetId } });
  if (!asset) {
    const err = new Error('Asset not found');
    (err as any).code = 'ASSET_NOT_FOUND';
    throw err;
  }

  // For GALLERY role, allow multiple photos by always creating new associations
  // For other roles, use upsert to replace existing
  if (assetRole === 'GALLERY') {
    return prisma.subcultureAsset.create({
      data: { subcultureId, assetId, assetRole },
      include: { asset: true },
    });
  } else {
    return prisma.subcultureAsset.upsert({
      where: {
        subcultureId_assetId: { subcultureId, assetId },
      },
      update: { assetRole },
      create: { subcultureId, assetId, assetRole },
      include: { asset: true },
    });
  }
};


export const removeAssetFromSubculture = async (subcultureId: number, assetId: number) => {
  try {
    return await prisma.subcultureAsset.delete({
      where: { subcultureId_assetId: { subcultureId, assetId } },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      const err = new Error('Association not found');
      (err as any).code = 'ASSOCIATION_NOT_FOUND';
      throw err;
    }
    throw error;
  }
};


export const getSubcultureAssets = async (id: number) => {
  return prisma.subcultureAsset.findMany({
    where: { subcultureId: id },
    include: { asset: true },
  });
};

export const getAllSubculturesPaginated = async (skip: number, limit: number) => {
  const [subcultures, total] = await Promise.all([
    prisma.subculture.findMany({
      skip,
      take: limit,
      include: {
        culture: true,
        domainKodifikasis: true,
        subcultureAssets: { include: { asset: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subculture.count(),
  ]);

  return { subcultures, total };
};

export const getSubculturesByCulture = async (cultureId: number) => {
  return prisma.subculture.findMany({
    where: { cultureId },
    include: {
      culture: true,
      domainKodifikasis: true,
      subcultureAssets: { include: { asset: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

