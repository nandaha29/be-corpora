import { prisma } from '../../lib/prisma.js';

// Get all published references
export const getPublishedReferences = async () => {
  return prisma.reference.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      referenceId: true,
      title: true,
      referenceType: true,
      description: true,
      url: true,
      authors: true,
      publicationYear: true,
      topicCategory: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          lexiconReferences: true,
          subcultureReferences: true,
          cultureReferences: true,
        },
      },
    },
    orderBy: [
      { publicationYear: 'desc' },
      { authors: 'asc' },
    ],
  });
};

// Get reference by ID (only if published)
export const getPublishedReferenceById = async (referenceId: number) => {
  return prisma.reference.findFirst({
    where: {
      referenceId,
      status: 'PUBLISHED',
    },
    select: {
      referenceId: true,
      title: true,
      referenceType: true,
      description: true,
      url: true,
      authors: true,
      publicationYear: true,
      topicCategory: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Search published references
export const searchPublishedReferences = async (keyword: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const enumValues = ['JOURNAL', 'BOOK', 'ARTICLE', 'WEBSITE', 'REPORT', 'THESIS', 'DISSERTATION', 'FIELD_NOTE'];
  const isEnumMatch = enumValues.includes(keyword.toUpperCase());

  const whereClause: any = {
    status: 'PUBLISHED', // Only published references
    OR: [
      { title: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
      { authors: { contains: keyword, mode: 'insensitive' } },
      { publicationYear: { contains: keyword, mode: 'insensitive' } },
      { topicCategory: { contains: keyword, mode: 'insensitive' } },
    ],
  };

  if (isEnumMatch) {
    whereClause.OR.push({ referenceType: { equals: keyword.toUpperCase() as any } });
  }

  const [data, total] = await Promise.all([
    prisma.reference.findMany({
      where: whereClause,
      skip,
      take: limit,
      select: {
        referenceId: true,
        title: true,
        referenceType: true,
        description: true,
        url: true,
        authors: true,
        publicationYear: true,
        topicCategory: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            lexiconReferences: true,
            subcultureReferences: true,
            cultureReferences: true,
          },
        },
      },
      orderBy: [
        { publicationYear: 'desc' },
        { authors: 'asc' },
      ],
    }),
    prisma.reference.count({
      where: whereClause,
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query: keyword,
    },
  };
};