import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importLexicons() {
  try {
    console.log('🚀 Starting LEXICON import...');

    const jsonPath = path.join(process.cwd(), 'exports', 'database_export_2025-11-21.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found: ${jsonPath}`);
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log('📊 Loaded JSON data');

    const lexicons = jsonData.tables.LEXICON;
    console.log(`📊 Importing LEXICON: ${lexicons.length} records`);

    let successCount = 0;
    for (const record of lexicons) {
      try {
        // Remove nested relations
        const { lexiconId, codificationDomain, contributor, lexiconAssets, lexiconReferences, ...lexiconData } = record;
        await prisma.lexicon.create({ data: lexiconData });
        successCount++;
      } catch (error) {
        console.error(`❌ LEXICON ${record.lexiconId} failed:`, error.message);
      }
    }

    console.log(`✅ LEXICON imported: ${successCount}`);
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importLexicons();