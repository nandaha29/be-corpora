import { prisma } from "../../lib/prisma.js";
import { CreateLexiconReferenceInput, CreateSubcultureReferenceInput, CreateCultureReferenceInput } from '../../lib/validators.js';

/**
 * REFERENCE JUNCTION SERVICE
 * Handles reference assignments to different entities (lexicon, subculture, culture)
 * Each reference can be assigned to multiple entities with different roles
 */

export const assignReferenceToLexicon = async (data: CreateLexiconReferenceInput) => {
  const { lexiconId, referenceId, referenceRole } = data;

  // Check if reference exists
  const reference = await prisma.reference.findUnique({
    where: { referenceId }
  });
  if (!reference) {
    throw new Error("Reference not found");
  }

  // Check if lexicon exists
  const lexicon = await prisma.lexicon.findUnique({
    where: { lexiconId }
  });
  if (!lexicon) {
    throw new Error("Lexicon not found");
  }

  // Check if assignment already exists
  const existing = await prisma.lexiconReference.findUnique({
    where: {
      lexiconId_referenceId: {
        lexiconId,
        referenceId
      }
    }
  });

  if (existing) {
    throw new Error("Reference already assigned to this lexicon");
  }

  return prisma.lexiconReference.create({
    data: {
      lexiconId,
      referenceId,
      referenceRole: referenceRole || "SECONDARY_SOURCE"
    },
    include: {
      reference: {
        select: {
          referenceId: true,
          title: true,
          referenceType: true,
          authors: true,
          publicationYear: true
        }
      },
      lexicon: {
        select: {
          lexiconId: true,
          lexiconWord: true,
          slug: true
        }
      }
    }
  });
};

export const assignReferenceToSubculture = async (data: CreateSubcultureReferenceInput) => {
  const { subcultureId, referenceId, referenceRole } = data;

  // Check if reference exists
  const reference = await prisma.reference.findUnique({
    where: { referenceId }
  });
  if (!reference) {
    throw new Error("Reference not found");
  }

  // Check if subculture exists
  const subculture = await prisma.subculture.findUnique({
    where: { subcultureId }
  });
  if (!subculture) {
    throw new Error("Subculture not found");
  }

  // Check if assignment already exists
  const existing = await prisma.subcultureReference.findUnique({
    where: {
      subcultureId_referenceId: {
        subcultureId,
        referenceId
      }
    }
  });

  if (existing) {
    throw new Error("Reference already assigned to this subculture");
  }

  return prisma.subcultureReference.create({
    data: {
      subcultureId,
      referenceId,
      referenceRole: referenceRole || "SECONDARY_SOURCE"
    },
    include: {
      reference: {
        select: {
          referenceId: true,
          title: true,
          referenceType: true,
          authors: true,
          publicationYear: true
        }
      },
      subculture: {
        select: {
          subcultureId: true,
          subcultureName: true,
          slug: true
        }
      }
    }
  });
};

export const assignReferenceToCulture = async (data: CreateCultureReferenceInput) => {
  const { cultureId, referenceId, referenceRole } = data;

  // Check if reference exists
  const reference = await prisma.reference.findUnique({
    where: { referenceId }
  });
  if (!reference) {
    throw new Error("Reference not found");
  }

  // Check if culture exists
  const culture = await prisma.culture.findUnique({
    where: { cultureId }
  });
  if (!culture) {
    throw new Error("Culture not found");
  }

  // Check if assignment already exists
  const existing = await prisma.cultureReference.findUnique({
    where: {
      cultureId_referenceId: {
        cultureId,
        referenceId
      }
    }
  });

  if (existing) {
    throw new Error("Reference already assigned to this culture");
  }

  return prisma.cultureReference.create({
    data: {
      cultureId,
      referenceId,
      referenceRole: referenceRole || "PRIMARY_SOURCE"
    },
    include: {
      reference: {
        select: {
          referenceId: true,
          title: true,
          referenceType: true,
          authors: true,
          publicationYear: true
        }
      },
      culture: {
        select: {
          cultureId: true,
          cultureName: true,
          slug: true
        }
      }
    }
  });
};

export const removeReferenceFromLexicon = async (lexiconId: number, referenceId: number) => {
  const existing = await prisma.lexiconReference.findUnique({
    where: {
      lexiconId_referenceId: {
        lexiconId,
        referenceId
      }
    }
  });

  if (!existing) {
    throw new Error("Reference assignment not found");
  }

  return prisma.lexiconReference.delete({
    where: {
      lexiconId_referenceId: {
        lexiconId,
        referenceId
      }
    }
  });
};

export const removeReferenceFromSubculture = async (subcultureId: number, referenceId: number) => {
  const existing = await prisma.subcultureReference.findUnique({
    where: {
      subcultureId_referenceId: {
        subcultureId,
        referenceId
      }
    }
  });

  if (!existing) {
    throw new Error("Reference assignment not found");
  }

  return prisma.subcultureReference.delete({
    where: {
      subcultureId_referenceId: {
        subcultureId,
        referenceId
      }
    }
  });
};

export const removeReferenceFromCulture = async (cultureId: number, referenceId: number) => {
  const existing = await prisma.cultureReference.findUnique({
    where: {
      cultureId_referenceId: {
        cultureId,
        referenceId
      }
    }
  });

  if (!existing) {
    throw new Error("Reference assignment not found");
  }

  return prisma.cultureReference.delete({
    where: {
      cultureId_referenceId: {
        cultureId,
        referenceId
      }
    }
  });
};

export const getReferenceUsageStats = async (referenceId: number) => {
  const [lexiconCount, subcultureCount, cultureCount] = await Promise.all([
    prisma.lexiconReference.count({
      where: { referenceId }
    }),
    prisma.subcultureReference.count({
      where: { referenceId }
    }),
    prisma.cultureReference.count({
      where: { referenceId }
    })
  ]);

  return {
    referenceId,
    lexiconCount,
    subcultureCount,
    cultureCount,
    totalUsage: lexiconCount + subcultureCount + cultureCount
  };
};

export const getReferencesByLexicon = async (lexiconId: number) => {
  return prisma.lexiconReference.findMany({
    where: { lexiconId },
    include: {
      reference: {
        select: {
          referenceId: true,
          title: true,
          referenceType: true,
          authors: true,
          publicationYear: true,
          url: true
        }
      }
    },
    orderBy: {
      displayOrder: 'asc'
    }
  });
};

export const getReferencesBySubculture = async (subcultureId: number) => {
  return prisma.subcultureReference.findMany({
    where: { subcultureId },
    include: {
      reference: {
        select: {
          referenceId: true,
          title: true,
          referenceType: true,
          authors: true,
          publicationYear: true,
          url: true
        }
      }
    },
    orderBy: {
      displayOrder: 'asc'
    }
  });
};

export const getReferencesByCulture = async (cultureId: number) => {
  return prisma.cultureReference.findMany({
    where: { cultureId },
    include: {
      reference: {
        select: {
          referenceId: true,
          title: true,
          referenceType: true,
          authors: true,
          publicationYear: true,
          url: true
        }
      }
    },
    orderBy: {
      displayOrder: 'asc'
    }
  });
};