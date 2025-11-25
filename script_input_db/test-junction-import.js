import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importJunctionTablesOnly() {
  try {
    console.log('📊 Starting junction table import with full error reporting...\n');
    
    const jsonPath = './exports/database_export_2025-11-21.json';
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Test Lexicon Assets first
    console.log('📊 Importing Leksikon Assets...');
    const lexAssets = jsonData.tables.LEXICON_ASSETS || [];
    let lexAssetSucc = 0, lexAssetFail = 0;
    for (const asset of lexAssets) {
      try {
        await prisma.lexiconAsset.create({
          data: {
            leksikonId: asset.lexiconId,
            assetId: asset.assetId,
            assetRole: asset.assetRole,
            createdAt: new Date(asset.createdAt)
          }
        });
        lexAssetSucc++;
      } catch (error) {
        lexAssetFail++;
        if (lexAssetFail <= 3) {
          console.error(`  ❌ Failed [${lexAssetFail}]: lexiconId=${asset.lexiconId}, assetId=${asset.assetId}`);
          console.error(`     Error: ${error.message.substring(0, 80)}`);
        }
      }
    }
    console.log(`✅ Imported: ${lexAssetSucc}, Failed: ${lexAssetFail}\n`);

    // Test Subculture Assets
    console.log('📊 Importing Subculture Assets...');
    const subcultureAssets = jsonData.tables.SUBCULTURE_ASSETS || [];
    let subcAssetSucc = 0, subcAssetFail = 0;
    for (const asset of subcultureAssets) {
      try {
        // Note: assetRole is part of composite key!
        await prisma.subcultureAsset.create({
          data: {
            subcultureId: asset.subcultureId,
            assetId: asset.assetId,
            assetRole: asset.assetRole,
            createdAt: new Date(asset.createdAt)
          }
        });
        subcAssetSucc++;
      } catch (error) {
        subcAssetFail++;
        if (subcAssetFail <= 3) {
          console.error(`  ❌ Failed [${subcAssetFail}]: subcultureId=${asset.subcultureId}, assetId=${asset.assetId}, assetRole=${asset.assetRole}`);
          console.error(`     Error: ${error.message.substring(0, 80)}`);
        }
      }
    }
    console.log(`✅ Imported: ${subcAssetSucc}, Failed: ${subcAssetFail}\n`);

    // Test Contributor Assets
    console.log('📊 Importing Contributor Assets...');
    const contribAssets = jsonData.tables.CONTRIBUTOR_ASSETS || [];
    let contribAssetSucc = 0, contribAssetFail = 0;
    for (const asset of contribAssets) {
      try {
        // Note: assetNote is required field
        await prisma.contributorAsset.create({
          data: {
            contributorId: asset.contributorId,
            assetId: asset.assetId,
            assetNote: asset.assetNote,
            createdAt: new Date(asset.createdAt)
          }
        });
        contribAssetSucc++;
      } catch (error) {
        contribAssetFail++;
        if (contribAssetFail <= 3) {
          console.error(`  ❌ Failed [${contribAssetFail}]: contributorId=${asset.contributorId}, assetId=${asset.assetId}, assetNote=${asset.assetNote}`);
          console.error(`     Error: ${error.message.substring(0, 80)}`);
        }
      }
    }
    console.log(`✅ Imported: ${contribAssetSucc}, Failed: ${contribAssetFail}\n`);

    // Test Lexicon References
    console.log('📊 Importing Lexicon References...');
    const lexRefs = jsonData.tables.LEXICON_REFERENCE || [];
    let lexRefSucc = 0, lexRefFail = 0;
    for (const ref of lexRefs) {
      try {
        await prisma.lexiconReference.create({
          data: {
            leksikonId: ref.lexiconId,
            referensiId: ref.referenceId,
            createdAt: new Date(ref.createdAt)
          }
        });
        lexRefSucc++;
      } catch (error) {
        lexRefFail++;
        if (lexRefFail <= 3) {
          console.error(`  ❌ Failed [${lexRefFail}]: lexiconId=${ref.lexiconId}, referenceId=${ref.referenceId}`);
          console.error(`     Error: ${error.message.substring(0, 80)}`);
        }
      }
    }
    console.log(`✅ Imported: ${lexRefSucc}, Failed: ${lexRefFail}\n`);

    console.log('=== FINAL SUMMARY ===');
    console.log(`Lexicon Assets:      ${lexAssetSucc}/${lexAssets.length}`);
    console.log(`Subculture Assets:   ${subcAssetSucc}/${subcultureAssets.length}`);
    console.log(`Contributor Assets:  ${contribAssetSucc}/${contribAssets.length}`);
    console.log(`Lexicon References:  ${lexRefSucc}/${lexRefs.length}`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importJunctionTablesOnly();
