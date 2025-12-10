import { prisma } from '../../lib/prisma.js';
import { CreateAboutReferenceInput, UpdateAboutReferenceInput } from '../../lib/validators.js';

export const getAllAboutReferences = async () => {
  return prisma.aboutReference.findMany({
    include: {
      reference: true,
    } as any,
    where: {
      isActive: true,
    } as any,
    orderBy: {
      displayOrder: 'asc',
    } as any,
  });
};

export const getAboutReferenceById = async (id: number) => {
  return prisma.aboutReference.findUnique({
    where: { aboutReferenceId: id },
    include: {
      reference: true,
    } as any,
  });
};

export const createAboutReference = async (data: CreateAboutReferenceInput) => {
  // Verify reference exists
  const reference = await prisma.reference.findUnique({
    where: { referenceId: data.referenceId },
  });
  if (!reference) {
    const err = new Error('Reference not found');
    (err as any).code = 'REFERENCE_NOT_FOUND';
    throw err;
  }

  // Get max display order for auto-increment
  const maxOrder = await prisma.aboutReference.aggregate({
    _max: {
      displayOrder: true,
    },
  } as any);

  const nextOrder = (maxOrder._max?.displayOrder || 0) + 1;

  return prisma.aboutReference.create({
    data: {
      referenceId: data.referenceId,
      displayOrder: data.displayOrder ?? nextOrder,
      isActive: data.isActive ?? true,
    },
    include: {
      reference: true,
    } as any,
  });
};

export const updateAboutReference = async (id: number, data: UpdateAboutReferenceInput) => {
  // Verify about reference exists
  const existing = await prisma.aboutReference.findUnique({
    where: { aboutReferenceId: id },
  });
  if (!existing) {
    const err = new Error('About reference not found');
    (err as any).code = 'ABOUT_REFERENCE_NOT_FOUND';
    throw err;
  }

  // If updating referenceId, verify new reference exists
  if (data.referenceId !== undefined) {
    const reference = await prisma.reference.findUnique({
      where: { referenceId: data.referenceId },
    });
    if (!reference) {
      const err = new Error('Reference not found');
      (err as any).code = 'REFERENCE_NOT_FOUND';
      throw err;
    }
  }

  return prisma.aboutReference.update({
    where: { aboutReferenceId: id },
    data,
    include: {
      reference: true,
    } as any,
  });
};

export const deleteAboutReference = async (id: number) => {
  return prisma.aboutReference.delete({
    where: { aboutReferenceId: id },
  });
};

export const reorderAboutReferences = async (updates: { aboutReferenceId: number; displayOrder: number }[]) => {
  const results = [];

  for (const update of updates) {
    const result = await prisma.aboutReference.update({
      where: { aboutReferenceId: update.aboutReferenceId },
      data: { displayOrder: update.displayOrder } as any,
      include: { reference: true } as any,
    });
    results.push(result);
  }

  return results;
};