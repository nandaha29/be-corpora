import { z } from "zod";

export const SubcultureSchema = z.object({
  subcultureId: z.number(),
  namaSubculture: z.string(),
  penjelasan: z.string(),
});

export const heroQuerySchema = z.object({
  cultureId: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 1)), // default cultureId 1
});

export const HeroResponseSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  provinsi: z.string().nullable(),
  subcultures: z.array(SubcultureSchema),
});

export const CultureSchema = z.object({
  cultureId: z.number(),
  namaBudaya: z.string(),
  pulauAsal: z.string().nullable(),
  provinsi: z.string().nullable(),
  kotaDaerah: z.string().nullable(),
  karakteristik: z.string().nullable(),
  statusKonservasi: z.string(),
});

export const AssetSchema = z.object({
  assetId: z.number(),
  namaFile: z.string(),
  tipe: z.string(),
  url: z.string(),
  penjelasan: z.string().nullable(),
});

export const StatisticsSchema = z.object({
  totalCultures: z.number(),
  totalSubcultures: z.number(),
  totalLeksikon: z.number(),
  totalContributors: z.number(),
});

export const ContributorSchema = z.object({
  contributorId: z.number(),
  namaContributor: z.string(),
  institusi: z.string(),
  expertiseArea: z.string(),
});

export const ReferenceSchema = z.object({
  referensiId: z.number(),
  judul: z.string(),
  tipeReferensi: z.string(),
  penulis: z.string().nullable(),
  tahunTerbit: z.string().nullable(),
  url: z.string().nullable(),
});
