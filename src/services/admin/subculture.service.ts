import { Prisma, PrismaClient, SubcultureAssetRole, ReferenceRole } from "@prisma/client";
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
      codificationDomains: true,
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
      codificationDomains: true,
      subcultureAssets: {
        include: { asset: true },
      },
      subcultureReferences: {
        include: { reference: true },
      },
    },
  });
};

export const createSubculture = async (data: CreateSubcultureInput) => {
  const slug = generateSlug(data.subcultureName);
  return prisma.subculture.create({ 
    data: {
      subcultureName: data.subcultureName,
      traditionalGreeting: data.traditionalGreeting,
      greetingMeaning: data.greetingMeaning,
      explanation: data.explanation,
      cultureId: data.cultureId,
      status: data.status,
      conservationStatus: data.conservationStatus,
      displayPriorityStatus: data.displayPriorityStatus,
      slug,
    }
  });
};

export const updateSubculture = async (id: number, data: UpdateSubcultureInput) => {
  console.log('UpdateSubculture called with id:', id);
  console.log('Input data:', data);
  
  let updateData: any = { ...data };
  
  if (data.subcultureName) {
    updateData.slug = generateSlug(data.subcultureName);
    console.log('Generated slug:', updateData.slug);
  }
  
  console.log('Final updateData to send to Prisma:', updateData);
  
  const result = await prisma.subculture.update({
    where: { subcultureId: id },
    data: updateData,
  });
  
  console.log('Update result:', result);
  return result;
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
        subcultureId_assetId_assetRole: { subcultureId, assetId, assetRole },
      },
      update: { assetRole },
      create: { subcultureId, assetId, assetRole },
      include: { asset: true },
    });
  }
};


export const removeAssetFromSubculture = async (subcultureId: number, assetId: number, assetRole: SubcultureAssetRole) => {
  try {
    return await prisma.subcultureAsset.delete({
      where: { subcultureId_assetId_assetRole: { subcultureId, assetId, assetRole } },
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
        codificationDomains: true,
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
      codificationDomains: true,
      subcultureAssets: { include: { asset: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getFilteredSubcultures = async (filters: {
  status?: string;
  statusPriorityDisplay?: string;
  statusKonservasi?: string;
  cultureId?: number;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  // Status filters
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.statusPriorityDisplay) {
    where.priorityDisplayStatus = filters.statusPriorityDisplay;
  }
  if (filters.statusKonservasi) {
    where.conservationStatus = filters.statusKonservasi;
  }
  if (filters.cultureId) {
    where.cultureId = filters.cultureId;
  }

  // Search filter
  if (filters.search) {
    where.OR = [
      { subcultureName: { contains: filters.search, mode: 'insensitive' } },
      { traditionalGreeting: { contains: filters.search, mode: 'insensitive' } },
      { explanation: { contains: filters.search, mode: 'insensitive' } },
      { culture: { cultureName: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.subculture.findMany({
      where,
      include: {
        culture: true,
        codificationDomains: true,
        subcultureAssets: { include: { asset: true } },
      },
      orderBy: [
        { displayPriorityStatus: 'desc' }, // HIGH first, then MEDIUM, LOW, HIDDEN
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
    }),
    prisma.subculture.count({ where }),
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
        statusPriorityDisplay: filters.statusPriorityDisplay || null,
        statusKonservasi: filters.statusKonservasi || null,
        cultureId: filters.cultureId || null,
        search: filters.search || null,
      },
    },
  };
};

export const getAssignedAssets = async (subcultureId: number) => {
  return prisma.subcultureAsset.findMany({
    where: { subcultureId },
    include: {
      asset: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAssignedReferences = async (subcultureId: number) => {
  // Get all leksikon that belong to this subculture's codificationDomains
  const domainIds = await prisma.codificationDomain.findMany({
    where: { subcultureId },
    select: { domainId: true },
  });

  const domainIdList = domainIds.map(d => d.domainId);

  // Get all references used by lexicons in those domains
  return prisma.lexiconReference.findMany({
    where: {
      lexicon: {
        domainId: { in: domainIdList },
      },
    },
    include: {
      reference: true,
      lexicon: {
        include: {
          codificationDomain: {
            include: {
              subculture: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const searchAssetsInSubculture = async (subcultureId: number, searchQuery: string) => {
  return prisma.subcultureAsset.findMany({
    where: {
      subcultureId,
      asset: {
        OR: [
          { fileName: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
    },
    include: {
      asset: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const searchReferencesInSubculture = async (subcultureId: number, searchQuery: string) => {
  // Get all lexicons that belong to this subculture's codificationDomains
  const domainIds = await prisma.codificationDomain.findMany({
    where: { subcultureId },
    select: { domainId: true },
  });

  const domainIdList = domainIds.map(d => d.domainId);

  // Search references used by lexicons in those domains
  return prisma.lexiconReference.findMany({
    where: {
      lexicon: {
        domainId: { in: domainIdList },
      },
      reference: {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { authors: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
    },
    include: {
      reference: true,
      lexicon: {
        include: {
          codificationDomain: {
            include: {
              subculture: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAssetUsage = async (assetId: number) => {
  return prisma.subcultureAsset.findMany({
    where: { assetId },
    include: {
      subculture: {
        include: {
          culture: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReferenceUsage = async (referenceId: number) => {
  return prisma.lexiconReference.findMany({
    where: { referenceId },
    include: {
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
    orderBy: { createdAt: 'desc' },
  });
};

export const addReferenceToSubculture = async (subcultureId: number, referenceId: number, lexiconId?: number, referenceRole?: ReferenceRole) => {
  // Verify subculture exists
  const subculture = await prisma.subculture.findUnique({ where: { subcultureId } });
  if (!subculture) {
    const err = new Error('Subculture not found');
    (err as any).code = 'SUBCULTURE_NOT_FOUND';
    throw err;
  }

  // Verify reference exists
  const reference = await prisma.reference.findUnique({ where: { referenceId } });
  if (!reference) {
    const err = new Error('Reference not found');
    (err as any).code = 'REFERENCE_NOT_FOUND';
    throw err;
  }

  if (lexiconId) {
    // Assign to specific lexicon
    const lexicon = await prisma.lexicon.findUnique({ where: { lexiconId } });
    if (!lexicon) {
      const err = new Error('Lexicon not found');
      (err as any).code = 'LEXICON_NOT_FOUND';
      throw err;
    }

    // Check if lexicon belongs to subculture
    const domainIds = await prisma.codificationDomain.findMany({
      where: { subcultureId },
      select: { domainId: true },
    });
    const domainIdList = domainIds.map(d => d.domainId);
    if (!domainIdList.includes(lexicon.domainId)) {
      const err = new Error('Lexicon does not belong to this subculture');
      (err as any).code = 'LEXICON_NOT_IN_SUBCULTURE';
      throw err;
    }

    const result = await prisma.lexiconReference.create({
      data: { lexiconId, referenceId, referenceRole },
      include: { reference: true, lexicon: true },
    });

    return {
      data: result,
      message: "Reference added to specific lexicon",
    };
  } else {
    // Assign to all lexicons in subculture
    const domainIds = await prisma.codificationDomain.findMany({
      where: { subcultureId },
      select: { domainId: true },
    });
    const domainIdList = domainIds.map(d => d.domainId);

    const lexicons = await prisma.lexicon.findMany({
      where: { domainId: { in: domainIdList } },
      select: { lexiconId: true },
    });

    const assignments = lexicons.map(lexicon => ({
      lexiconId: lexicon.lexiconId,
      referenceId,
      referenceRole,
    }));

    const result = await prisma.lexiconReference.createMany({
      data: assignments,
      skipDuplicates: true,
    });

    return {
      count: result.count,
      message: result.count > 0 
        ? `Reference added to ${result.count} lexicons` 
        : `No new references added (possibly duplicates or no lexicons found)`,
    };
  }
};

export const filterSubcultureAssets = async (subcultureId: number, filters: {
  type?: string;
  assetRole?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = { subcultureId };

  // Add type filter
  if (filters.type) {
    const normalized = filters.type.toUpperCase();
    const allowed = ["PHOTO", "AUDIO", "VIDEO", "MODEL_3D"];
    if (allowed.includes(normalized)) {
      where.asset = { fileType: normalized as any };
    }
  }

  // Add assetRole filter
  if (filters.assetRole) {
    const normalized = filters.assetRole.toUpperCase();
    const allowed = ["HIGHLIGHT", "THUMBNAIL", "GALLERY", "BANNER", "VIDEO_DEMO", "MODEL_3D"];
    if (allowed.includes(normalized)) {
      where.assetRole = normalized as any;
    }
  }

  // Add status filter
  if (filters.status) {
    const normalized = filters.status.toUpperCase();
    const allowed = ["ACTIVE", "PROCESSING", "ARCHIVED", "CORRUPTED"];
    if (allowed.includes(normalized)) {
      where.asset = { status: normalized as any };
    }
  }

  const [data, total] = await Promise.all([
    prisma.subcultureAsset.findMany({
      where,
      include: { asset: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subcultureAsset.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        type: filters.type || null,
        assetRole: filters.assetRole || null,
        status: filters.status || null,
      },
    },
  };
};

export const filterSubcultureReferences = async (subcultureId: number, filters: {
  referenceType?: string;
  publicationYear?: string;
  status?: string;
  referenceRole?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Get domain IDs for subculture
  const domainIds = await prisma.codificationDomain.findMany({
    where: { subcultureId },
    select: { domainId: true },
  });
  const domainIdList = domainIds.map(d => d.domainId);

  const where: any = {
    lexicon: {
      domainId: { in: domainIdList },
    },
  };

  // Add referenceType filter
  if (filters.referenceType) {
    const normalized = filters.referenceType.toUpperCase();
    const allowed = ["JOURNAL", "BOOK", "ARTICLE", "WEBSITE", "REPORT"];
    if (allowed.includes(normalized)) {
      where.reference = { referenceType: normalized as any };
    }
  }

  // Add publicationYear filter
  if (filters.publicationYear) {
    where.reference = { ...where.reference, publicationYear: { contains: filters.publicationYear, mode: 'insensitive' } };
  }

  // Add status filter
  if (filters.status) {
    const normalized = filters.status.toUpperCase();
    const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (allowed.includes(normalized)) {
      where.reference = { ...where.reference, status: normalized as any };
    }
  }

  // Add referenceRole filter
  if (filters.referenceRole) {
    const normalized = filters.referenceRole.toUpperCase();
    const allowed = ["PRIMARY_SOURCE", "SECONDARY_SOURCE", "ILLUSTRATIVE", "BACKGROUND", "SUPPORTING"];
    if (allowed.includes(normalized)) {
      where.referenceRole = normalized as any;
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
                subculture: true,
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
        referenceRole: filters.referenceRole || null,
      },
    },
  };
};

// Assign reference directly to SubcultureReference (for subculture page)
export const addReferenceToSubcultureDirect = async (
  subcultureId: number,
  referenceId: number,
  displayOrder?: number,
  referenceRole?: ReferenceRole
) => {
  // Verify subculture exists
  const subculture = await prisma.subculture.findUnique({ where: { subcultureId } });
  if (!subculture) {
    const err = new Error('Subculture not found');
    (err as any).code = 'SUBCULTURE_NOT_FOUND';
    throw err;
  }

  // Verify reference exists
  const reference = await prisma.reference.findUnique({ where: { referenceId } });
  if (!reference) {
    const err = new Error('Reference not found');
    (err as any).code = 'REFERENCE_NOT_FOUND';
    throw err;
  }

  // Use upsert to avoid duplicates
  return prisma.subcultureReference.upsert({
    where: {
      subcultureId_referenceId: {
        subcultureId,
        referenceId,
      },
    },
    update: {
      displayOrder: displayOrder ?? 0,
      referenceRole: referenceRole,
    },
    create: {
      subcultureId,
      referenceId,
      displayOrder: displayOrder ?? 0,
      referenceRole: referenceRole,
    },
    include: {
      reference: true,
      subculture: true,
    },
  });
};

// Remove reference from SubcultureReference
export const removeReferenceFromSubcultureDirect = async (
  subcultureId: number,
  referenceId: number
) => {
  return prisma.subcultureReference.delete({
    where: {
      subcultureId_referenceId: {
        subcultureId,
        referenceId,
      },
    },
  });
};

// Get all references assigned directly to subculture
export const getSubcultureReferencesDirect = async (subcultureId: number) => {
  return prisma.subcultureReference.findMany({
    where: { subcultureId },
    include: {
      reference: true,
    },
    orderBy: { displayOrder: 'asc' },
  });
};

