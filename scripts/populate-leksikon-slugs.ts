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

    // Get all lexicons without slug or with empty slug
    const lexicons = await prisma.lexicon.findMany({
      where: {
        OR: [
          { slug: null },
          { slug: "" }
        ]
      } as any,
    });

    console.log(`Found ${lexicons.length} lexicons without slug`);

    for (const lexicon of lexicons) {
      const slug = generateSlug(lexicon.lexiconWord);

      // Check if slug already exists (to handle duplicates)
      const existing = await prisma.lexicon.findUnique({
        where: { slug } as any,
      });

      let finalSlug = slug;
      if (existing && existing.lexiconId !== lexicon.lexiconId) {
        // Append ID to make unique
        finalSlug = `${slug}-${lexicon.lexiconId}`;
      }

      await prisma.lexicon.update({
        where: { lexiconId: lexicon.lexiconId },
        data: { slug: finalSlug } as any,
      });

      console.log(`Updated ${lexicon.lexiconWord} -> ${finalSlug}`);
    }

    console.log("Leksikon slug population completed!");
  } catch (error) {
    console.error("Error populating leksikon slugs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

populateLeksikonSlugs();