import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importFromJSON() {
  try {
    console.log('🚀 Starting import from JSON...');
    
    const jsonPath = path.join(process.cwd(), 'exports', 'database_export_2025-12-04.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found: ${jsonPath}`);
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log('📊 Loaded JSON data');

    // Import in order to respect foreign keys
    const importOrder = [
      'ADMIN',
      'CULTURE', 
      'SUBCULTURE',
      'CODIFICATION_DOMAIN',
      'CONTRIBUTOR',
      'ASSET',
      'REFERENCE',
      'LEXICON',
      'LEXICON_ASSETS',
      'SUBCULTURE_ASSETS', 
      'CULTURE_ASSETS',
      'CONTRIBUTOR_ASSETS',
      'LEXICON_REFERENCE',
      'SUBCULTURE_REFERENCE',
      'CULTURE_REFERENCE'
    ];

    for (const table of importOrder) {
      if (!jsonData.tables[table]) {
        console.log(`⚠️  Skipping ${table} - not found in JSON`);
        continue;
      }
      
      const records = jsonData.tables[table];
      console.log(`📊 Importing ${table}: ${records.length} records`);
      
      let successCount = 0;
      for (const record of records) {
        try {
          switch (table) {
            case 'ADMIN':
              await prisma.admin.create({ data: record });
              break;
            case 'CULTURE':
              const { subcultures, cultureAssets, cultureReferences, ...cultureData } = record;
              await prisma.culture.create({ data: cultureData });
              break;
            case 'SUBCULTURE':
              const { culture, codificationDomains, subcultureAssets, ...subcultureData } = record;
              await prisma.subculture.create({ data: subcultureData });
              break;
            case 'CODIFICATION_DOMAIN':
              await prisma.codificationDomain.create({ data: record });
              break;
            case 'CONTRIBUTOR':
              await prisma.contributor.create({ data: record });
              break;
            case 'ASSET':
              await prisma.asset.create({ data: record });
              break;
            case 'REFERENCE':
              await prisma.reference.create({ data: record });
              break;
            case 'LEXICON':
              const { codificationDomain, contributor, lexiconAssets, lexiconReferences, ...lexiconData } = record;
              try {
                await prisma.lexicon.create({ data: lexiconData });
              } catch (lexiconError) {
                console.warn(`⚠️  LEXICON ${record.lexiconId} failed:`, lexiconError.message);
                continue;
              }
              break;
            case 'LEXICON_ASSETS':
              const { lexicon, asset, ...lexiconAssetData } = record;
              await prisma.lexiconAsset.create({ data: lexiconAssetData });
              break;
            case 'SUBCULTURE_ASSETS':
              const { subculture: subcultureAssetSubculture, asset: subcultureAssetAsset, ...subcultureAssetData } = record;
              await prisma.subcultureAsset.create({ data: subcultureAssetData });
              break;
            case 'CULTURE_ASSETS':
              const { culture: cultureAssetCulture, asset: cultureAssetAsset, ...cultureAssetData } = record;
              await prisma.cultureAsset.create({ data: cultureAssetData });
              break;
            case 'CONTRIBUTOR_ASSETS':
              const { contributor: contributorAssetContributor, asset: contributorAssetAsset, ...contributorAssetData } = record;
              await prisma.contributorAsset.create({ data: contributorAssetData });
              break;
            case 'LEXICON_REFERENCE':
              const { lexicon: lexiconRefLexicon, reference: lexiconRefReference, citationNote, ...lexiconRefData } = record;
              await prisma.lexiconReference.create({ data: lexiconRefData });
              break;
            case 'SUBCULTURE_REFERENCE':
              const { subculture: subcultureRefSubculture, reference: subcultureRefReference, citationNote: subCitNote, ...subcultureRefData } = record;
              await prisma.subcultureReference.create({ data: subcultureRefData });
              break;
            case 'CULTURE_REFERENCE':
              const { culture: cultureRefCulture, reference: cultureRefReference, citationNote: cultCitNote, ...cultureRefData } = record;
              await prisma.cultureReference.create({ data: cultureRefData });
              break;
          }
          successCount++;
        } catch (error) {
          console.warn(`⚠️  Skipped ${table} record: ${error.message}`);
        }
      }
      console.log(`✅ ${table}: ${successCount}/${records.length} imported`);
    }

    console.log('🎉 JSON import completed!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const args = process.argv.slice(2);
if (args[0] === 'json') {
  importFromJSON();
} else {
  console.log('Usage:');
  console.log('  node import-database.js json  # Import from JSON file');
}