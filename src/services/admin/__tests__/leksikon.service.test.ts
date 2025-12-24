import { getAllLeksikons, getLeksikonById, createLeksikon, updateLeksikon, deleteLeksikon } from '../leksikon.service';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    lexicon: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    codificationDomain: {
      findUnique: jest.fn(),
    },
    contributor: {
      findUnique: jest.fn(),
    },
  },
}));

describe('leksikonService - WHITE BOX TESTING', () => {
  const mockLeksikon = {
    lexiconId: 1,
    lexiconWord: 'Test Term',
    ipaInternationalPhoneticAlphabet: 'tɛst',
    transliteration: 'test',
    etymologicalMeaning: 'Test etymology',
    culturalMeaning: 'Test culture',
    commonMeaning: 'Test common',
    translation: 'Test translation',
    status: 'DRAFT',
    domainId: 1,
    contributorId: 1,
    slug: 'test-term',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLeksikons', () => {
    it('should return all leksikons', async () => {
      (prisma.lexicon.findMany as jest.Mock).mockResolvedValue([mockLeksikon]);

      const result = await getAllLeksikons();

      expect(prisma.lexicon.findMany).toHaveBeenCalledWith({
        include: expect.any(Object),
      });
      expect(result).toEqual([mockLeksikon]);
    });

    it('should handle database errors', async () => {
      (prisma.lexicon.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(getAllLeksikons()).rejects.toThrow('Database error');
    });
  });

  describe('getLeksikonById', () => {
    it('should return leksikon by id', async () => {
      (prisma.lexicon.findUnique as jest.Mock).mockResolvedValue(mockLeksikon);

      const result = await getLeksikonById(1);

      expect(prisma.lexicon.findUnique).toHaveBeenCalledWith({
        where: { lexiconId: 1 },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockLeksikon);
    });

    it('should return null if leksikon not found', async () => {
      (prisma.lexicon.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getLeksikonById(999);

      expect(result).toBeNull();
    });
  });

  describe('createLeksikon', () => {
    const createData = {
      lexiconWord: 'New Term',
      ipaInternationalPhoneticAlphabet: 'nuː tɜːrm',
      transliteration: 'new term',
      etymologicalMeaning: 'New etymology',
      culturalMeaning: 'New culture',
      commonMeaning: 'New common',
      translation: 'New translation',
      domainId: 1,
      contributorId: 1,
    };

    beforeEach(() => {
      (prisma.codificationDomain.findUnique as jest.Mock).mockResolvedValue({ domainId: 1, domainName: 'Test Domain' });
      (prisma.contributor.findUnique as jest.Mock).mockResolvedValue({ contributorId: 1, name: 'Test Contributor' });
    });

    it('should create a new leksikon', async () => {
      (prisma.lexicon.create as jest.Mock).mockResolvedValue(mockLeksikon);

      const result = await createLeksikon(createData);

      expect(prisma.codificationDomain.findUnique).toHaveBeenCalledWith({ where: { domainId: 1 } });
      expect(prisma.contributor.findUnique).toHaveBeenCalledWith({ where: { contributorId: 1 } });
      expect(prisma.lexicon.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          lexiconWord: createData.lexiconWord,
          domainId: createData.domainId,
          contributorId: createData.contributorId,
        }),
        include: expect.any(Object),
      });
      expect(result).toEqual(mockLeksikon);
    });

    it('should handle duplicate term error', async () => {
      const error = new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '1.0.0',
      });
      (prisma.lexicon.create as jest.Mock).mockRejectedValue(error);

      await expect(createLeksikon(createData)).rejects.toThrow();
    });

    it('should throw error if domain not found', async () => {
      (prisma.codificationDomain.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(createLeksikon(createData)).rejects.toThrow('Domain not found');
    });

    it('should throw error if contributor not found', async () => {
      (prisma.codificationDomain.findUnique as jest.Mock).mockResolvedValue({ domainId: 1 });
      (prisma.contributor.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(createLeksikon(createData)).rejects.toThrow('Contributor not found');
    });
  });

  describe('updateLeksikon', () => {
    const updateData = {
      lexiconWord: 'Updated Term',
      commonMeaning: 'Updated common',
    };

    beforeEach(() => {
      (prisma.codificationDomain.findUnique as jest.Mock).mockResolvedValue({ domainId: 1 });
      (prisma.contributor.findUnique as jest.Mock).mockResolvedValue({ contributorId: 1 });
    });

    it('should update leksikon successfully', async () => {
      (prisma.lexicon.update as jest.Mock).mockResolvedValue({ ...mockLeksikon, ...updateData, slug: 'updated-term' });

      const result = await updateLeksikon(1, updateData);

      expect(prisma.lexicon.update).toHaveBeenCalledWith({
        where: { lexiconId: 1 },
        data: { ...updateData, slug: 'updated-term' },
        include: {
          codificationDomain: true,
          contributor: true,
          lexiconAssets: { include: { asset: true } },
          lexiconReferences: { include: { reference: true } },
        },
      });
      expect(result.lexiconWord).toBe('Updated Term');
    });

    it('should throw error if leksikon not found', async () => {
      const error = new PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '1.0.0',
      });
      (prisma.lexicon.update as jest.Mock).mockRejectedValue(error);

      await expect(updateLeksikon(999, updateData)).rejects.toThrow();
    });
  });

  describe('deleteLeksikon', () => {
    it('should delete leksikon successfully', async () => {
      (prisma.lexicon.delete as jest.Mock).mockResolvedValue(mockLeksikon);

      const result = await deleteLeksikon(1);

      expect(prisma.lexicon.delete).toHaveBeenCalledWith({
        where: { lexiconId: 1 },
      });
      expect(result).toEqual(mockLeksikon);
    });

    it('should throw error if leksikon not found', async () => {
      const error = new PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '1.0.0',
      });
      (prisma.lexicon.delete as jest.Mock).mockRejectedValue(error);

      await expect(deleteLeksikon(999)).rejects.toThrow();
    });
  });
});
