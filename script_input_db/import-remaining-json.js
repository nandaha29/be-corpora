import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importAllFromJSON() {
  try {
    console.log('📊 Starting comprehensive import from JSON...');
    
    const jsonPath = './exports/database_export_2025-11-21.json';
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Import Domain Kodifikasi
    console.log('📊 Importing Domain Kodifikasi...');
    const domains = jsonData.tables.CODIFICATION_DOMAIN || [];
    let domainCount = 0;
    for (const domain of domains) {
      try {
        // Extract only the fields needed for the model
        await prisma.codificationDomain.create({
          data: {
            domainId: domain.domainId,
            code: domain.code,
            domainName: domain.domainName,
            explanation: domain.explanation,
            subcultureId: domain.subcultureId,
            status: domain.status,
            createdAt: new Date(domain.createdAt),
            updatedAt: new Date(domain.updatedAt)
          }
        });
        domainCount++;
      } catch (error) {
        console.warn(`Skipped domain ${domain.domainId}: ${error.message.substring(0, 50)}`);
      }
    }
    console.log(`✅ Imported ${domainCount} domain records (${domains.length - domainCount} skipped)`);

    // Import Leksikon
    console.log('📊 Importing Leksikon...');
    const leksikons = jsonData.tables.LEXICON || [];
    let leksikonCount = 0;
    for (const lex of leksikons) {
      try {
        await prisma.lexicon.create({
          data: {
            lexiconId: lex.lexiconId,
            slug: lex.slug,
            lexiconWord: lex.lexiconWord,
            ipaInternationalPhoneticAlphabet: lex.ipaInternationalPhoneticAlphabet || '',
            transliteration: lex.transliteration || '',
            etymologicalMeaning: lex.etymologicalMeaning || '',
            culturalMeaning: lex.culturalMeaning || '',
            commonMeaning: lex.commonMeaning || '',
            translation: lex.translation || '',
            variant: lex.variant || null,
            variantTranslations: lex.variantTranslations || null,
            otherDescription: lex.otherDescription || null,
            domainId: lex.domainId,
            preservationStatus: lex.preservationStatus || 'MAINTAINED',
            contributorId: lex.contributorId,
            status: lex.status || 'DRAFT',
            createdAt: new Date(lex.createdAt),
            updatedAt: new Date(lex.updatedAt)
          }
        });
        leksikonCount++;
      } catch (error) {
        console.warn(`Skipped leksikon ${lex.lexiconId}: ${error.message.substring(0, 80)}`);
      }
    }
    console.log(`✅ Imported ${leksikonCount} leksikon records (${leksikons.length - leksikonCount} skipped)`);

    // Import Lexicon Assets (junction table)
    console.log('📊 Importing Leksikon Assets...');
    const lexAssets = jsonData.tables.LEXICON_ASSETS || [];
    let lexAssetCount = 0;
    for (const asset of lexAssets) {
      try {
        // Note: JSON uses 'lexiconId' not 'leksikonId'
        await prisma.lexiconAsset.create({
          data: {
            leksikonId: asset.lexiconId,
            assetId: asset.assetId,
            assetRole: asset.assetRole,
            createdAt: new Date(asset.createdAt)
          }
        });
        lexAssetCount++;
      } catch (error) {
        console.warn(`Skipped leksikon asset: ${error.message.substring(0, 50)}`);
      }
    }
    console.log(`✅ Imported ${lexAssetCount} leksikon asset records (${lexAssets.length - lexAssetCount} skipped)`);

    // Import Lexicon References (junction table)
    console.log('📊 Importing Leksikon References...');
    const lexRefs = jsonData.tables.LEXICON_REFERENCE || [];
    let lexRefCount = 0;
    for (const ref of lexRefs) {
      try {
        // Note: JSON uses 'lexiconId' not 'leksikonId', 'referenceId' not 'referensiId'
        await prisma.lexiconReference.create({
          data: {
            leksikonId: ref.lexiconId,
            referensiId: ref.referenceId,
            createdAt: new Date(ref.createdAt)
          }
        });
        lexRefCount++;
      } catch (error) {
        console.warn(`Skipped leksikon reference: ${error.message.substring(0, 50)}`);
      }
    }
    console.log(`✅ Imported ${lexRefCount} leksikon reference records (${lexRefs.length - lexRefCount} skipped)`);

    // Import Subculture Assets
    console.log('📊 Importing Subculture Assets...');
    const subcultureAssets = jsonData.tables.SUBCULTURE_ASSETS || [];
    let subAssetCount = 0;
    for (const asset of subcultureAssets) {
      try {
        await prisma.subcultureAsset.create({
          data: {
            subcultureId: asset.subcultureId,
            assetId: asset.assetId,
            assetRole: asset.assetRole,
            createdAt: new Date(asset.createdAt)
          }
        });
        subAssetCount++;
      } catch (error) {
        console.warn(`Skipped subculture asset: ${error.message.substring(0, 50)}`);
      }
    }
    console.log(`✅ Imported ${subAssetCount} subculture asset records (${subcultureAssets.length - subAssetCount} skipped)`);

    // Import Culture Assets
    console.log('📊 Importing Culture Assets...');
    const cultureAssets = jsonData.tables.CULTURE_ASSETS || [];
    let culAssetCount = 0;
    for (const asset of cultureAssets) {
      try {
        await prisma.cultureAsset.create({
          data: {
            cultureId: asset.cultureId,
            assetId: asset.assetId,
            createdAt: new Date(asset.createdAt)
          }
        });
        culAssetCount++;
      } catch (error) {
        console.warn(`Skipped culture asset: ${error.message.substring(0, 50)}`);
      }
    }
    console.log(`✅ Imported ${culAssetCount} culture asset records (${cultureAssets.length - culAssetCount} skipped)`);

    // Import Contributor Assets
    console.log('📊 Importing Contributor Assets...');
    const contribAssets = jsonData.tables.CONTRIBUTOR_ASSETS || [];
    let contribAssetCount = 0;
    for (const asset of contribAssets) {
      try {
        // Note: JSON has 'assetNote' field but Prisma schema doesn't include it
        await prisma.contributorAsset.create({
          data: {
            contributorId: asset.contributorId,
            assetId: asset.assetId,
            createdAt: new Date(asset.createdAt)
          }
        });
        contribAssetCount++;
      } catch (error) {
        console.warn(`Skipped contributor asset: ${error.message.substring(0, 50)}`);
      }
    }
    console.log(`✅ Imported ${contribAssetCount} contributor asset records (${contribAssets.length - contribAssetCount} skipped)`);

    console.log('\n✅ All imports completed!');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importAllFromJSON();
