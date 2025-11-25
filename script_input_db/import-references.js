import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importReferences() {
  try {
    // Read the JSON export file
    const data = JSON.parse(fs.readFileSync('./exports/database_export_2025-11-21.json', 'utf8'));

    const references = data.tables.REFERENCE;

    console.log(`Found ${references.length} references to import`);

    let importedCount = 0;
    let skippedCount = 0;

    for (const ref of references) {
      try {
        // Map fields from JSON to Prisma schema
        const referenceData = {
          referenceId: ref.referenceId,
          title: ref.title,
          referenceType: ref.referenceType,
          description: ref.explanation, // Map explanation to description
          url: ref.url,
          authors: ref.author, // Map author to authors
          publicationYear: ref.publicationYear,
          topicCategory: null, // Not present in JSON
          status: ref.status,
          createdAt: new Date(ref.createdAt),
          updatedAt: new Date(ref.updatedAt),
        };

        // Check if reference already exists
        const existing = await prisma.reference.findUnique({
          where: { referenceId: ref.referenceId }
        });

        if (existing) {
          console.log(`Reference ${ref.referenceId} (${ref.title}) already exists, skipping`);
          skippedCount++;
          continue;
        }

        // Create the reference
        await prisma.reference.create({
          data: referenceData
        });

        console.log(`Imported reference: ${ref.title}`);
        importedCount++;

      } catch (error) {
        console.error(`Error importing reference ${ref.referenceId}:`, error.message);
      }
    }

    console.log(`\nImport completed:`);
    console.log(`- Imported: ${importedCount} references`);
    console.log(`- Skipped: ${skippedCount} references (already exist)`);

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importReferences();