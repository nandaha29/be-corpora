import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportAllData() {
  try {
    console.log('🚀 Starting database export...');

    const exportData = {
      exportedAt: new Date().toISOString(),
      tables: {}
    };

    // Export Admin data
    console.log('📊 Exporting Admin data...');
    exportData.tables['ADMIN'] = await prisma.admin.findMany();

    // Export Culture data
    console.log('📊 Exporting Culture data...');
    exportData.tables['CULTURE'] = await prisma.culture.findMany({
      include: {
        subcultures: true,
        cultureAssets: true
      }
    });

    // Export Subculture data
    console.log('📊 Exporting Subculture data...');
    exportData.tables['SUBCULTURE'] = await prisma.subculture.findMany({
      include: {
        culture: true,
        codificationDomains: true,
        subcultureAssets: true
      }
    });

    // Export DomainKodifikasi data
    console.log('📊 Exporting CodificationDomain data...');
    exportData.tables['CODIFICATION_DOMAIN'] = await prisma.codificationDomain.findMany({
      include: {
        subculture: true,
        lexicons: true
      }
    });

    // Export Leksikon data
    console.log('📊 Exporting Lexicon data...');
    exportData.tables['LEXICON'] = await prisma.lexicon.findMany({
      include: {
        codificationDomain: {
          include: {
            subculture: {
              include: {
                culture: true
              }
            }
          }
        },
        contributor: true,
        lexiconAssets: {
          include: {
            asset: true
          }
        },
        lexiconReferences: {
          include: {
            reference: true
          }
        }
      }
    });

    // Export Contributor data
    console.log('📊 Exporting Contributor data...');
    exportData.tables['CONTRIBUTOR'] = await prisma.contributor.findMany({
      include: {
        contributorAssets: {
          include: {
            asset: true
          }
        },
        lexicons: true
      }
    });

    // Export Asset data
    console.log('📊 Exporting Asset data...');
    exportData.tables['ASSET'] = await prisma.asset.findMany();

    // Export Reference data
    console.log('📊 Exporting Reference data...');
    exportData.tables['REFERENCE'] = await prisma.reference.findMany();

    // Export junction tables
    console.log('📊 Exporting junction tables...');
    exportData.tables['LEXICON_ASSETS'] = await prisma.lexiconAsset.findMany({
      include: {
        lexicon: true,
        asset: true
      }
    });

    exportData.tables['SUBCULTURE_ASSETS'] = await prisma.subcultureAsset.findMany({
      include: {
        subculture: true,
        asset: true
      }
    });

    exportData.tables['CULTURE_ASSETS'] = await prisma.cultureAsset.findMany({
      include: {
        culture: true,
        asset: true
      }
    });

    exportData.tables['CONTRIBUTOR_ASSETS'] = await prisma.contributorAsset.findMany({
      include: {
        contributor: true,
        asset: true
      }
    });

    exportData.tables['LEXICON_REFERENCE'] = await prisma.lexiconReference.findMany({
      include: {
        lexicon: true,
        reference: true
      }
    });

    exportData.tables['SUBCULTURE_REFERENCE'] = await prisma.subcultureReference.findMany({
      include: {
        subculture: true,
        reference: true
      }
    });

    exportData.tables['CULTURE_REFERENCE'] = await prisma.cultureReference.findMany({
      include: {
        culture: true,
        reference: true
      }
    });

    // Create exports directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Export to JSON file
    const jsonFilePath = path.join(exportDir, `database_export_${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(exportData, null, 2));

    console.log(`✅ Export completed successfully!`);
    console.log(`📁 File saved to: ${jsonFilePath}`);

    // Show summary
    console.log('\n📈 Export Summary:');
    Object.entries(exportData.tables).forEach(([table, data]) => {
      console.log(`   ${table}: ${Array.isArray(data) ? data.length : 0} records`);
    });

  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the export
exportAllData();