import { searchCultures, globalSearch, searchLeksikons, advancedSearch } from '../../public/search.service';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    culture: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    lexicon: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    subculture: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('searchService - WHITE BOX TESTING', () => {
  const mockCulture = {
    cultureId: 1,
    cultureName: 'Test Culture',
    originIsland: 'Java',
    province: 'West Java',
    cityRegion: 'Bandung',
    classification: 'Traditional',
    characteristics: 'Colorful',
    status: 'PUBLISHED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLexicon = {
    lexiconId: 1,
    lexiconWord: 'Test Word',
    commonMeaning: 'Test meaning',
    status: 'PUBLISHED',
    slug: 'test-word',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchCultures', () => {
    it('should return cultures matching query with pagination', async () => {
      (prisma.culture.findMany as jest.Mock).mockResolvedValue([mockCulture]);
      (prisma.culture.count as jest.Mock).mockResolvedValue(1);

      const result = await searchCultures('test', 1, 10);

      expect(prisma.culture.findMany).toHaveBeenCalledWith({
        where: {
          status: 'PUBLISHED',
          OR: expect.any(Array),
        },
        skip: 0,
        take: 10,
        orderBy: { cultureId: 'asc' },
        include: expect.any(Object),
      });
      expect(result.data).toEqual([mockCulture]);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should handle empty query', async () => {
      (prisma.culture.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.culture.count as jest.Mock).mockResolvedValue(0);

      const result = await searchCultures('', 1, 10);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle database errors', async () => {
      (prisma.culture.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(searchCultures('test')).rejects.toThrow('Database error');
    });
  });

  describe('globalSearch', () => {
    it('should return combined search results', async () => {
      (prisma.culture.findMany as jest.Mock).mockResolvedValue([mockCulture]);
      (prisma.lexicon.findMany as jest.Mock).mockResolvedValue([mockLexicon]);
      (prisma.subculture.findMany as jest.Mock).mockResolvedValue([]);

      const result = await globalSearch('test');

      expect(result.leksikons).toEqual([mockLexicon]);
      expect(result.cultures).toEqual([mockCulture]);
      expect(result.subcultures).toEqual([]);
    });

    it('should apply filters correctly', async () => {
      (prisma.culture.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.lexicon.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.subculture.findMany as jest.Mock).mockResolvedValue([]);

      const filters = { culture_id: 1, domain_id: 2 };
      await globalSearch('test', filters);

      expect(prisma.lexicon.findMany).toHaveBeenCalledWith({
        where: {
          cultureId: 1,
          domainId: 2,
          OR: expect.any(Array),
        },
        include: expect.any(Object),
        take: 50,
      });
    });
  });

  describe('searchLeksikons', () => {
    it('should return lexicons matching query', async () => {
      (prisma.lexicon.findMany as jest.Mock).mockResolvedValue([mockLexicon]);

      const result = await searchLeksikons('test');

      expect(prisma.lexicon.findMany).toHaveBeenCalledWith({
        where: {
          OR: expect.any(Array),
        },
        include: expect.any(Object),
        take: 100,
      });
      expect(result).toEqual([mockLexicon]);
    });

    it('should handle no results', async () => {
      (prisma.lexicon.findMany as jest.Mock).mockResolvedValue([]);

      const result = await searchLeksikons('nonexistent');

      expect(result).toEqual([]);
    });
  });

  describe('advancedSearch', () => {
    const searchParams = {
      kata: 'test',
      makna: 'meaning',
      dk_id: 1,
      culture_id: 2,
      subculture_id: 3,
      status: 'PUBLISHED',
    };

    it('should perform advanced search with filters', async () => {
      (prisma.lexicon.findMany as jest.Mock).mockResolvedValue([mockLexicon]);

      const result = await advancedSearch(searchParams);

      expect(prisma.lexicon.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: expect.any(Array),
          domainId: 1,
          codificationDomain: expect.any(Object),
          status: 'PUBLISHED',
        }),
        include: expect.any(Object),
        take: 100,
      });
      expect(result).toEqual([mockLexicon]);
    });

    it('should handle partial parameters', async () => {
      const partialParams = { kata: 'test' };
      (prisma.lexicon.findMany as jest.Mock).mockResolvedValue([]);

      const result = await advancedSearch(partialParams);

      expect(result).toEqual([]);
    });
  });
});
