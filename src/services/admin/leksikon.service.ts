import { prisma } from '../../lib/prisma.js';
import { CreateLexiconInput, UpdateLexiconInput } from '../../lib/validators.js';
import { Prisma, LeksikonAssetRole, CitationNoteType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Helper function to generate slug
const generateSlug = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'unnamed-term'; // fallback for empty names
  }
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing dashes
};

export const getAllLeksikons = async () => {
  return prisma.lexicon.findMany({
    include: {
      codificationDomain: true,
      contributor: true,
      lexiconAssets: { include: { asset: true } },
      lexiconReferences: { include: { reference: true } },
    },
  });
};

export const getLeksikonById = async (id: number) => {
  return prisma.lexicon.findUnique({
    where: { lexiconId: id },
    include: {
      codificationDomain: true,
      contributor: true,
      lexiconAssets: { include: { asset: true } },
      lexiconReferences: { include: { reference: true } },
    },
  });
};

export const createLeksikon = async (data: CreateLexiconInput) => {
  // verify domain exists
  const domain = await prisma.codificationDomain.findUnique({
    where: { domainId: data.domainId },
  });
  if (!domain) {
    const err = new Error('Domain not found');
    (err as any).code = 'DOMAIN_NOT_FOUND';
    throw err;
  }

  // verify contributor exists
  const contributor = await prisma.contributor.findUnique({
    where: { contributorId: data.contributorId },
  });
  if (!contributor) {
    const err = new Error('Contributor not found');
    (err as any).code = 'CONTRIBUTOR_NOT_FOUND';
    throw err;
  }

  try {
    const slug = generateSlug(data.lexiconWord);
    const created = await prisma.lexicon.create({
      data: {
        lexiconWord: data.lexiconWord,
        slug,
        ipaInternationalPhoneticAlphabet: data.ipaInternationalPhoneticAlphabet,
        transliteration: data.transliteration,
        etymologicalMeaning: data.etymologicalMeaning,
        culturalMeaning: data.culturalMeaning,
        commonMeaning: data.commonMeaning,
        translation: data.translation,
        variant: data.variant ?? null,
        variantTranslations: data.variantTranslations ?? null,
        otherDescription: data.otherDescription ?? null,
        domainId: data.domainId,
        preservationStatus: data.preservationStatus ?? undefined,
        contributorId: data.contributorId,
        status: data.status ?? undefined,
      } as any,
      include: {
        codificationDomain: true,
        contributor: true,
        lexiconAssets: { include: { asset: true } },
        lexiconReferences: { include: { reference: true } },
      },
    });
    return created;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // handle known Prisma errors if you add unique constraints later
    }
    throw error;
  }
};

export const updateLeksikon = async (id: number, data: UpdateLexiconInput) => {
  // check relation updates
  if (data.domainId !== undefined) {
    const domain = await prisma.codificationDomain.findUnique({
      where: { domainId: data.domainId },
    });
    if (!domain) {
      const err = new Error('Domain not found');
      (err as any).code = 'DOMAIN_NOT_FOUND';
      throw err;
    }
  }
  if (data.contributorId !== undefined) {
    const contributor = await prisma.contributor.findUnique({
      where: { contributorId: data.contributorId },
    });
    if (!contributor) {
      const err = new Error('Contributor not found');
      (err as any).code = 'CONTRIBUTOR_NOT_FOUND';
      throw err;
    }
  }

  try {
    const updateData: any = {
      ...(data.lexiconWord !== undefined && { lexiconWord: data.lexiconWord }),
      ...(data.ipaInternationalPhoneticAlphabet !== undefined && { ipaInternationalPhoneticAlphabet: data.ipaInternationalPhoneticAlphabet }),
      ...(data.transliteration !== undefined && { transliteration: data.transliteration }),
      ...(data.etymologicalMeaning !== undefined && { etymologicalMeaning: data.etymologicalMeaning }),
      ...(data.culturalMeaning !== undefined && { culturalMeaning: data.culturalMeaning }),
      ...(data.commonMeaning !== undefined && { commonMeaning: data.commonMeaning }),
      ...(data.translation !== undefined && { translation: data.translation }),
      ...(data.variant !== undefined && { variant: data.variant }),
      ...(data.variantTranslations !== undefined && { variantTranslations: data.variantTranslations }),
      ...(data.otherDescription !== undefined && { otherDescription: data.otherDescription }),
      ...(data.domainId !== undefined && { domainId: data.domainId }),
      ...(data.preservationStatus !== undefined && { preservationStatus: data.preservationStatus }),
      ...(data.contributorId !== undefined && { contributorId: data.contributorId }),
      ...(data.status !== undefined && { status: data.status }),
    };

    // Regenerate slug if lexiconWord is being updated
    if (data.lexiconWord !== undefined) {
      updateData.slug = generateSlug(data.lexiconWord);
    }

    const updated = await prisma.lexicon.update({
      where: { lexiconId: id },
      data: updateData as any,
      include: {
        codificationDomain: true,
        contributor: true,
        lexiconAssets: { include: { asset: true } },
        lexiconReferences: { include: { reference: true } },
      },
    });
    return updated;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // P2025: record to update not found
      if (error.code === 'P2025') {
        throw error; // bubble to controller to map to 404
      }
    }
    throw error;
  }
};

export const deleteLeksikon = async (id: number) => {
  return prisma.lexicon.delete({
    where: { lexiconId: id },
  });
};

// export const addAssetToLeksikon = async (leksikonId: number, assetId: number, assetRole: string) => {
//   // verify leksikon exists
//   const leksikon = await prisma.leksikon.findUnique({
//     where: { leksikonId },
//   });
//   if (!leksikon) {
//     const err = new Error('Leksikon not found');
//     (err as any).code = 'LEKSIKON_NOT_FOUND';
//     throw err;
//   }

//   // verify asset exists
//   const asset = await prisma.asset.findUnique({
//     where: { assetId },
//   });
//   if (!asset) {
//     const err = new Error('Asset not found');
//     (err as any).code = 'ASSET_NOT_FOUND';
//     throw err;
//   }

//   return prisma.leksikonAsset.create({
//     data: { leksikonId, assetId, assetRole },
//     include: { asset: true },
//   });
// };

export const addAssetToLeksikon = async (leksikonId: number, assetId: number, assetRole: LeksikonAssetRole) => {
  // Pastikan leksikon dan asset ada
  const leksikon = await prisma.lexicon.findUnique({ where: { lexiconId: leksikonId } });
  if (!leksikon) {
    const err = new Error('Leksikon not found');
    (err as any).code = 'LEKSIKON_NOT_FOUND';
    throw err;
  }

  const asset = await prisma.asset.findUnique({ where: { assetId } });
  if (!asset) {
    const err = new Error('Asset not found');
    (err as any).code = 'ASSET_NOT_FOUND';
    throw err;
  }

  // Gunakan upsert agar tidak duplikat dan tidak menimbulkan rekursi
  return prisma.lexiconAsset.upsert({
    where: {
      lexiconId_assetId: {
        lexiconId: leksikonId,
        assetId,
      },
    },
    update: {
      assetRole,
    },
    create: {
      lexiconId: leksikonId,
      assetId,
      assetRole,
    },
  });
};


export const removeAssetFromLeksikon = async (leksikonId: number, assetId: number) => {
  return prisma.lexiconAsset.delete({
    where: { lexiconId_assetId: { lexiconId: leksikonId, assetId } },
  });
};

export const getLeksikonAssets = async (id: number) => {
  return prisma.lexiconAsset.findMany({
    where: { lexiconId: id },
    include: { asset: true },
  });
};

// export const addReferenceToLeksikon = async (leksikonId: number, referensiId: number, citationNote?: string) => {
//   // verify leksikon exists
//   const leksikon = await prisma.leksikon.findUnique({
//     where: { leksikonId },
//   });
//   if (!leksikon) {
//     const err = new Error('Leksikon not found');
//     (err as any).code = 'LEKSIKON_NOT_FOUND';
//     throw err;
//   }

//   // verify referensi exists
//   const referensi = await prisma.referensi.findUnique({
//     where: { referensiId },
//   });
//   if (!referensi) {
//     const err = new Error('Referensi not found');
//     (err as any).code = 'REFERENSI_NOT_FOUND';
//     throw err;
//   }

//   return prisma.leksikonReferensi.create({
//     data: { leksikonId, referensiId, citationNote },
//     include: { referensi: true },
//   });
// };

export const addReferenceToLeksikon = async  (leksikonId: number, referenceId: number, citationNote?: CitationNoteType) => {
  const leksikon = await prisma.lexicon.findUnique({ where: { lexiconId: leksikonId } });
  if (!leksikon) {
    const err = new Error('Leksikon not found');
    (err as any).code = 'LEKSIKON_NOT_FOUND';
    throw err;
  }

  const referensi = await prisma.reference.findUnique({ where: { referenceId: referenceId } });
  if (!referensi) {
    const err = new Error('Referensi not found');
    (err as any).code = 'REFERENSI_NOT_FOUND';
    throw err;
  }

  // Gunakan upsert agar tidak duplikat
  return prisma.lexiconReference.upsert({
    where: {
      lexiconId_referenceId: {
        lexiconId: leksikonId,
        referenceId,
      },
    },
    update: {
      citationNote,
    },
    create: {
      lexiconId: leksikonId,
      referenceId,
      citationNote,
    },
  });
};


export const removeReferenceFromLeksikon = async (leksikonId: number, referenceId: number) => {
  return prisma.lexiconReference.delete({
    where: { lexiconId_referenceId: { lexiconId: leksikonId, referenceId } },
  });
};

export const getLeksikonReferences = async (id: number) => {
  return prisma.lexiconReference.findMany({
    where: { lexiconId: id },
    include: { reference: true },
  });
};

// UPDATE assetRole di relasi leksikonAsset
export const updateAssetRole = async (
  leksikonId: number,
  assetId: number,
  assetRole: LeksikonAssetRole
) => {
  // Pastikan relasi ada
  const existing = await prisma.lexiconAsset.findUnique({
    where: { lexiconId_assetId: { lexiconId: leksikonId, assetId } },
  });

  if (!existing) {
    const err = new Error('Association not found');
    (err as any).code = 'ASSOCIATION_NOT_FOUND';
    throw err;
  }

  return prisma.lexiconAsset.update({
    where: { lexiconId_assetId: { lexiconId: leksikonId, assetId } },
    data: { assetRole },
    include: { asset: true },
  });
};

// UPDATE citationNote di relasi leksikonReferensi
export const updateCitationNote = async (
  leksikonId: number,
  referenceId: number,
  citationNote?: CitationNoteType
) => {
  const existing = await prisma.lexiconReference.findUnique({
    where: { lexiconId_referenceId: { lexiconId: leksikonId, referenceId: referenceId } },
  });

  if (!existing) {
    const err = new Error('Association not found');
    (err as any).code = 'ASSOCIATION_NOT_FOUND';
    throw err;
  }

  return prisma.lexiconReference.update({
    where: { lexiconId_referenceId: { lexiconId: leksikonId, referenceId: referenceId } },
    data: { citationNote },
    include: { reference: true },
  });
};

export const getAllLeksikonsPaginated = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.lexicon.findMany({
      skip,
      take: limit,
      include: {
        codificationDomain: true,
        contributor: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.lexicon.count(),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getLeksikonsByDomain = async (domainId: number) => {
  return prisma.lexicon.findMany({
    where: { domainId },
    include: {
      codificationDomain: true,
      contributor: true,
    },
  });
};

export const getLeksikonsByStatus = async (status?: string) => {
  // If no status provided, return all leksikons
  if (!status) {
    return prisma.lexicon.findMany({
      include: {
        codificationDomain: true,
        contributor: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  // Normalize and validate status (handle lowercase query params)
  const normalized = String(status).toUpperCase();
  const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  if (!allowed.includes(normalized)) {
    // Return empty array for unknown status to be forgiving for clients
    return [];
  }

  return prisma.lexicon.findMany({
    where: { status: normalized as any },
    include: {
      codificationDomain: true,
      contributor: true,
    },
    orderBy: { updatedAt: "desc" },
  });
};

// Filter leksikons by status and/or domain with pagination
export const filterLeksikons = async (filters: {
  status?: string;
  domainId?: number;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Build where condition dynamically
  const whereCondition: any = {};

  // Add status filter if provided
  if (filters.status) {
    const normalized = String(filters.status).toUpperCase();
    const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (allowed.includes(normalized)) {
      whereCondition.status = normalized as any;
    }
  }

  // Add domain filter if provided
  if (filters.domainId) {
    whereCondition.domainId = filters.domainId;
  }

  const [data, total] = await Promise.all([
    prisma.lexicon.findMany({
      where: whereCondition,
      include: {
        codificationDomain: true,
        contributor: true,
      },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.lexicon.count({ where: whereCondition }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        status: filters.status || null,
        domainId: filters.domainId || null,
      },
    },
  };
};

export const updateLeksikonStatus = async (id: number, status: string) => {
  const normalized = String(status).toUpperCase();
  const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  if (!allowed.includes(normalized)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return prisma.lexicon.update({
    where: { lexiconId: id },
    data: { status: normalized as any },
  });
};

// GET assets by assetRole for a specific lexicon
export const getAssetsByRole = async (lexiconId: number, assetRole: LeksikonAssetRole) => {
  return prisma.lexiconAsset.findMany({
    where: {
      lexiconId,
      assetRole,
    },
    include: {
      asset: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// ============================================
// 🔍 SEARCH & USAGE TRACKING FUNCTIONS
// ============================================

// Search assets used in lexicons by query (fileName, fileType, description)
export const searchAssetsInLeksikons = async (query: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const whereCondition = {
    lexiconAssets: {
      some: {}, // Assets that are linked to at least one leksikon
    },
    OR: query ? [
      { fileName: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
    ] : undefined,
  };

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where: whereCondition,
      include: {
        lexiconAssets: {
          include: {
            lexicon: {
              include: {
                codificationDomain: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { fileName: 'asc' },
    }),
    prisma.asset.count({ where: whereCondition }),
  ]);

  return {
    data: assets,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get all assets that are assigned to any leksikon
export const getAssignedAssets = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where: {
        lexiconAssets: {
          some: {}, // Only assets that have at least one leksikon association
        },
      },
      include: {
        lexiconAssets: {
          include: {
            lexicon: {
              include: {
                codificationDomain: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { fileName: 'asc' },
    }),
    prisma.asset.count({
      where: {
        lexiconAssets: {
          some: {},
        },
      },
    }),
  ]);

  return {
    data: assets,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get which leksikons use a specific asset
export const getAssetUsage = async (assetId: number) => {
  return prisma.lexiconAsset.findMany({
    where: { assetId },
    include: {
      lexicon: {
        include: {
          codificationDomain: true,
          contributor: true,
        },
      },
      asset: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Search references used in lexicons by query (title, authors, referenceType)
export const searchReferencesInLeksikons = async (query: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const whereCondition = {
    lexiconReferences: {
      some: {}, // References that are linked to at least one leksikon
    },
    OR: query ? [
      { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { authors: { contains: query, mode: Prisma.QueryMode.insensitive } },
    ] : undefined,
  };

  const [references, total] = await Promise.all([
    prisma.reference.findMany({
      where: whereCondition,
      include: {
        lexiconReferences: {
          include: {
            lexicon: {
              include: {
                codificationDomain: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { title: 'asc' },
    }),
    prisma.reference.count({ where: whereCondition }),
  ]);

  return {
    data: references,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get all references that are assigned to any leksikon
export const getAssignedReferences = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [references, total] = await Promise.all([
    prisma.reference.findMany({
      where: {
        lexiconReferences: {
          some: {}, // Only references that have at least one leksikon association
        },
      },
      include: {
        lexiconReferences: {
          include: {
            lexicon: {
              include: {
                codificationDomain: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { title: 'asc' },
    }),
    prisma.reference.count({
      where: {
        lexiconReferences: {
          some: {},
        },
      },
    }),
  ]);

  return {
    data: references,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get which leksikons use a specific reference
export const getReferenceUsage = async (referenceId: number) => {
  return prisma.lexiconReference.findMany({
    where: { referenceId },
    include: {
      lexicon: {
        include: {
          codificationDomain: true,
          contributor: true,
        },
      },
      reference: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Filter assets assigned to leksikons by Type, Status, Created At (kombinasi)
export const filterLeksikonAssets = async (filters: {
  fileType?: string;
  status?: string;
  createdAt?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  // Add fileType filter
  if (filters.fileType) {
    const normalized = filters.fileType.toUpperCase();
    const allowed = ['PHOTO', 'AUDIO', 'VIDEO', 'MODEL_3D'];
    if (allowed.includes(normalized)) {
      where.asset = { ...where.asset, fileType: normalized as any };
    }
  }

  // Add status filter
  if (filters.status) {
    const normalized = filters.status.toUpperCase();
    const allowed = ['ACTIVE', 'PROCESSING', 'ARCHIVED', 'CORRUPTED'];
    if (allowed.includes(normalized)) {
      where.asset = { ...where.asset, status: normalized as any };
    }
  }

  // Add createdAt filter (assuming date range or exact date)
  if (filters.createdAt) {
    // Assuming filters.createdAt is a date string, filter by exact date or range
    // For simplicity, filter by date greater than or equal
    const date = new Date(filters.createdAt);
    if (!isNaN(date.getTime())) {
      where.asset = { ...where.asset, createdAt: { gte: date } };
    }
  }

  const [data, total] = await Promise.all([
    prisma.lexiconAsset.findMany({
      where,
      include: {
        asset: true,
        lexicon: {
          include: {
            codificationDomain: {
              include: {
                subculture: {
                  include: {
                    culture: true,
                  },
                },
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lexiconAsset.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        fileType: filters.fileType || null,
        status: filters.status || null,
        createdAt: filters.createdAt || null,
      },
    },
  };
};

// Filter references assigned to leksikons by Type, Year, Status (kombinasi)
export const filterLeksikonReferences = async (filters: {
  referenceType?: string;
  publicationYear?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  // Add referenceType filter
  if (filters.referenceType) {
    const normalized = filters.referenceType.toUpperCase();
    const allowed = ['JURNAL', 'BUKU', 'ARTIKEL', 'WEBSITE', 'LAPORAN'];
    if (allowed.includes(normalized)) {
      where.referensi = { ...where.referensi, referenceType: normalized as any };
    }
  }

  // Add publicationYear filter
  if (filters.publicationYear) {
    where.referensi = { ...where.referensi, publicationYear: { contains: filters.publicationYear, mode: 'insensitive' } };
  }

  // Add status filter
  if (filters.status) {
    const normalized = filters.status.toUpperCase();
    const allowed = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (allowed.includes(normalized)) {
      where.referensi = { ...where.referensi, status: normalized as any };
    }
  }

  const [data, total] = await Promise.all([
    prisma.lexiconReference.findMany({
      where,
      include: {
        reference: true,
        lexicon: {
          include: {
            codificationDomain: {
              include: {
                subculture: {
                  include: {
                    culture: true,
                  },
                },
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lexiconReference.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        referenceType: filters.referenceType || null,
        publicationYear: filters.publicationYear || null,
        status: filters.status || null,
      },
    },
  };
};