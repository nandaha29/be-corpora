import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importLexiconAssets() {
  try {
    console.log('🚀 Starting lexicon assets import...');

    const csvPath = path.join(process.cwd(), 'exports', 'leksikon_assets.csv');

    if (!fs.existsSync(csvPath)) {
      console.error('❌ leksikon_assets.csv not found');
      return;
    }

    const csvData = fs.readFileSync(csvPath, 'utf8')
      .split('\n')
      .slice(1) // Skip header
      .filter(line => line.trim());

    console.log(`📊 Found ${csvData.length} lexicon asset records to import`);

    let importedCount = 0;
    let skippedCount = 0;

    for (const line of csvData) {
      try {
        // Parse CSV line - handle quoted fields with JSON
        const fields = parseCSVLine(line);

        const lexiconId = parseInt(fields[0].replace(/"/g, ''));
        const assetId = parseInt(fields[1].replace(/"/g, ''));
        const assetRole = fields[2].replace(/"/g, '');
        const createdAtStr = fields[3].replace(/"/g, '').replace(/"""|""""/g, '');

        // Check if already exists
        const existing = await prisma.lexiconAsset.findUnique({
          where: {
            lexiconId_assetId: {
              lexiconId,
              assetId
            }
          }
        });

        if (existing) {
          console.log(`⏭️  Skipping existing lexicon asset: lexiconId=${lexiconId}, assetId=${assetId}`);
          skippedCount++;
          continue;
        }

        const createdAt = createdAtStr ? new Date(createdAtStr) : new Date();

        await prisma.lexiconAsset.create({
          data: {
            lexiconId,
            assetId,
            assetRole,
            createdAt,
          }
        });

        importedCount++;
        console.log(`✅ Imported lexicon asset: lexiconId=${lexiconId}, assetId=${assetId}, role=${assetRole}`);

      } catch (error) {
        console.error(`❌ Error importing line: ${line.substring(0, 100)}...`, error.message);
      }
    }

    console.log(`✅ Import completed: ${importedCount} imported, ${skippedCount} skipped`);

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Function to properly parse CSV line with quoted fields containing JSON
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
    i++;
  }

  // Add the last field
  result.push(current);

  return result;
}

importLexiconAssets();