import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function populateLeksikonSlugs() {
  try {
    console.log("Starting leksikon slug population...");

    // Get all leksikons without slug or with empty slug
    const leksikons = await prisma.leksikon.findMany({
      where: {
        OR: [
          { slug: null },
          { slug: "" }
        ]
      } as any,
    });

    console.log(`Found ${leksikons.length} leksikons without slug`);

    for (const leksikon of leksikons) {
      const slug = generateSlug(leksikon.kataLeksikon);

      // Check if slug already exists (to handle duplicates)
      const existing = await prisma.leksikon.findUnique({
        where: { slug } as any,
      });

      let finalSlug = slug;
      if (existing && existing.leksikonId !== leksikon.leksikonId) {
        // Append ID to make unique
        finalSlug = `${slug}-${leksikon.leksikonId}`;
      }

      await prisma.leksikon.update({
        where: { leksikonId: leksikon.leksikonId },
        data: { slug: finalSlug } as any,
      });

      console.log(`Updated ${leksikon.kataLeksikon} -> ${finalSlug}`);
    }

    console.log("Leksikon slug population completed!");
  } catch (error) {
    console.error("Error populating leksikon slugs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

populateLeksikonSlugs();