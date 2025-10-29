import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import * as landingPageService from "@/services//public/landingPage.services";

/** HERO SECTION — newest culture */
export async function getHeroSection(req: Request, res: Response) {
  try {
    const cultureId = 1; // sementara hardcoded, nanti bisa dynamic kalau mau
    const data = await landingPageService.getHeroData(cultureId);

    if (!data) {
      return res.status(404).json({ message: "Culture not found" });
    }

    res.status(200).json({
      namaBudaya: data.namaBudaya,
      assetsSubculture: data.assetsSubculture,
    });
  } catch (err) {
    console.error("Error in getHeroSection:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/** CULTURES SECTION — all published cultures */
export const getAllCultures = async (_: Request, res: Response) => {
  try {
    const cultures = await prisma.culture.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: {
        cultureId: true,
        namaBudaya: true,
        pulauAsal: true,
        provinsi: true,
        kotaDaerah: true,
        karakteristik: true,
        statusKonservasi: true,
      },
    });
    res.status(200).json(cultures);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/** SUBCULTURES SECTION — latest 6 */
export const getSubcultures = async (_: Request, res: Response) => {
  try {
    const subcultures = await prisma.subculture.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        culture: {
          select: { namaBudaya: true, provinsi: true },
        },
      },
    });
    res.status(200).json(subcultures);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/** GALLERY SECTION — latest 10 photos/videos */
export const getGallery = async (_: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ tipe: "FOTO" }, { tipe: "VIDEO" }],
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        assetId: true,
        namaFile: true,
        tipe: true,
        url: true,
        penjelasan: true,
      },
    });
    res.status(200).json(assets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/** STATISTICS SECTION — counts */
export const getStatistics = async (_: Request, res: Response) => {
  try {
    const [cultures, subcultures, leksikons, contributors] = await Promise.all([
      prisma.culture.count(),
      prisma.subculture.count(),
      prisma.leksikon.count(),
      prisma.contributor.count(),
    ]);

    res.status(200).json({
      totalCultures: cultures,
      totalSubcultures: subcultures,
      totalLeksikon: leksikons,
      totalContributors: contributors,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/** REFERENCES SECTION — all published references */
export const getReferences = async (_: Request, res: Response) => {
  try {
    const references = await prisma.referensi.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: {
        referensiId: true,
        judul: true,
        tipeReferensi: true,
        penulis: true,
        tahunTerbit: true,
        url: true,
      },
    });
    res.status(200).json(references);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/** CONTRIBUTORS SECTION — latest 6 */
export const getContributors = async (_: Request, res: Response) => {
  try {
    const contributors = await prisma.contributor.findMany({
      orderBy: { registeredAt: "desc" },
      take: 6,
      select: {
        contributorId: true,
        namaContributor: true,
        institusi: true,
        expertiseArea: true,
      },
    });
    res.status(200).json(contributors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
