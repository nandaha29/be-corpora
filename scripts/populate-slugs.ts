import { PrismaClient } from "@prisma/client";

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

async function populateSlugs() {
  try {
    console.log("Starting slug population...");

    // Get all subcultures without slug
    const subcultures = await prisma.subculture.findMany({
      where: { slug: "" },
    });

    console.log(`Found ${subcultures.length} subcultures without slug`);

    for (const subculture of subcultures) {
      const slug = generateSlug(subculture.subcultureName);

      // Check if slug already exists
      const existing = await prisma.subculture.findUnique({
        where: { slug },
      });

      let finalSlug = slug;
      if (existing) {
        // Append ID to make unique
        finalSlug = `${slug}-${subculture.subcultureId}`;
      }

      await prisma.subculture.update({
        where: { subcultureId: subculture.subcultureId },
        data: { slug: finalSlug },
      });

      console.log(`Updated ${subculture.subcultureName} -> ${finalSlug}`);
    }

    console.log("Slug population completed!");
  } catch (error) {
    console.error("Error populating slugs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

populateSlugs();