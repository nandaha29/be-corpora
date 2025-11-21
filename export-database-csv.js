import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Helper function to convert array/object to CSV-safe string
function toCsvValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
  return String(value).replace(/"/g, '""');
}

// Helper function to export table to CSV
async function exportTableToCSV(tableName, data, filename) {
  if (!data || data.length === 0) {
    console.log(`⚠️  No data for ${tableName}`);
    return;
  }

  const exportDir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  const csvPath = path.join(exportDir, filename);

  // Get all unique keys from all objects
  const allKeys = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });

  const headers = Array.from(allKeys);

  // Create CSV content
  let csvContent = headers.join(',') + '\n';

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return `"${toCsvValue(value)}"`;
    });
    csvContent += values.join(',') + '\n';
  });

  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✅ ${tableName} exported to ${filename} (${data.length} records)`);
}

async function exportAllDataToCSV() {
  try {
    console.log('🚀 Starting CSV database export...');

    // Create exports directory
    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Export each table to separate CSV file
    console.log('📊 Exporting Admin data...');
    const adminData = await prisma.admin.findMany();
    await exportTableToCSV('ADMIN', adminData, 'admin.csv');

    console.log('📊 Exporting Culture data...');
    const cultureData = await prisma.culture.findMany({
      include: {
        subcultures: true,
        cultureAssets: true
      }
    });
    await exportTableToCSV('CULTURE', cultureData, 'culture.csv');

    console.log('📊 Exporting Subculture data...');
    const subcultureData = await prisma.subculture.findMany({
      include: {
        culture: true,
        domainKodifikasis: true,
        subcultureAssets: true
      }
    });
    await exportTableToCSV('SUBCULTURE', subcultureData, 'subculture.csv');

    console.log('📊 Exporting DomainKodifikasi data...');
    const domainData = await prisma.domainKodifikasi.findMany({
      include: {
        subculture: true,
        leksikons: true
      }
    });
    await exportTableToCSV('DOMAIN_KODIFIKASI', domainData, 'domain_kodifikasi.csv');

    console.log('📊 Exporting Leksikon data...');
    const leksikonData = await prisma.leksikon.findMany({
      include: {
        domainKodifikasi: {
          include: {
            subculture: {
              include: {
                culture: true
              }
            }
          }
        },
        contributor: true,
        leksikonAssets: {
          include: {
            asset: true
          }
        },
        leksikonReferensis: {
          include: {
            referensi: true
          }
        }
      }
    });
    await exportTableToCSV('LEKSIKON', leksikonData, 'leksikon.csv');

    console.log('📊 Exporting Contributor data...');
    const contributorData = await prisma.contributor.findMany({
      include: {
        contributorAssets: {
          include: {
            asset: true
          }
        },
        leksikons: true
      }
    });
    await exportTableToCSV('CONTRIBUTOR', contributorData, 'contributor.csv');

    console.log('📊 Exporting Asset data...');
    const assetData = await prisma.asset.findMany();
    await exportTableToCSV('ASSET', assetData, 'asset.csv');

    console.log('📊 Exporting Referensi data...');
    const referensiData = await prisma.referensi.findMany();
    await exportTableToCSV('REFERENSI', referensiData, 'referensi.csv');

    // Export junction tables
    console.log('📊 Exporting junction tables...');

    const leksikonAssetsData = await prisma.leksikonAsset.findMany({
      include: {
        leksikon: true,
        asset: true
      }
    });
    await exportTableToCSV('LEKSIKON_ASSETS', leksikonAssetsData, 'leksikon_assets.csv');

    const subcultureAssetsData = await prisma.subcultureAsset.findMany({
      include: {
        subculture: true,
        asset: true
      }
    });
    await exportTableToCSV('SUBCULTURE_ASSETS', subcultureAssetsData, 'subculture_assets.csv');

    const cultureAssetsData = await prisma.cultureAsset.findMany({
      include: {
        culture: true,
        asset: true
      }
    });
    await exportTableToCSV('CULTURE_ASSETS', cultureAssetsData, 'culture_assets.csv');

    const contributorAssetsData = await prisma.contributorAsset.findMany({
      include: {
        contributor: true,
        asset: true
      }
    });
    await exportTableToCSV('CONTRIBUTOR_ASSETS', contributorAssetsData, 'contributor_assets.csv');

    const leksikonReferensiData = await prisma.leksikonReferensi.findMany({
      include: {
        leksikon: true,
        referensi: true
      }
    });
    await exportTableToCSV('LEKSIKON_REFERENSI', leksikonReferensiData, 'leksikon_referensi.csv');

    console.log('✅ CSV export completed successfully!');
    console.log(`📁 Files saved to: ${exportDir}`);

  } catch (error) {
    console.error('❌ CSV export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the CSV export
exportAllDataToCSV();