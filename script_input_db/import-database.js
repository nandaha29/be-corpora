import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importDatabaseFromSQL() {
  try {
    console.log('🚀 Starting database import from SQL...');

    const sqlPath = path.join(process.cwd(), 'exports', 'database_backup.sql');

    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found: ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);

    console.log(`📊 Found ${statements.length} SQL statements to execute`);

    // Execute statements in batches to avoid memory issues
    const batchSize = 100;
    let executedCount = 0;

    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize);
      console.log(`📦 Executing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(statements.length/batchSize)} (${batch.length} statements)`);

      for (const statement of batch) {
        const cleanStatement = statement.trim();
        if (cleanStatement && !cleanStatement.startsWith('--')) {
          try {
            await prisma.$executeRawUnsafe(cleanStatement);
            executedCount++;
          } catch (error) {
            console.error(`❌ Failed to execute: ${cleanStatement.substring(0, 100)}...`);
            console.error(`Error: ${error.message}`);
            // Continue with other statements
          }
        }
      }
    }

    console.log(`✅ Import completed! Executed ${executedCount} statements successfully`);

    // Reset sequences to avoid conflicts
    console.log('🔄 Resetting database sequences...');
    await resetSequences();

    console.log('🎉 Database import and sequence reset completed!');

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function resetSequences() {
  try {
    // Reset all sequences to max current values
    const sequences = [
      { table: 'ADMIN', column: 'admin_id', sequence: 'ADMIN_admin_id_seq' },
      { table: 'CULTURE', column: 'culture_id', sequence: 'CULTURE_culture_id_seq' },
      { table: 'SUBCULTURE', column: 'subculture_id', sequence: 'SUBCULTURE_subculture_id_seq' },
      { table: 'DOMAIN_KODIFIKASI', column: 'dk_id', sequence: 'DOMAIN_KODIFIKASI_dk_id_seq' },
      { table: 'LEKSIKON', column: 'leksikon_id', sequence: 'LEKSIKON_leksikon_id_seq' },
      { table: 'CONTRIBUTOR', column: 'contributor_id', sequence: 'CONTRIBUTOR_contributor_id_seq' },
      { table: 'ASSET', column: 'asset_id', sequence: 'ASSET_asset_id_seq' },
      { table: 'REFERENSI', column: 'referensi_id', sequence: 'REFERENSI_referensi_id_seq' },
    ];

    for (const seq of sequences) {
      try {
        // Get max value from table
        const result = await prisma.$queryRawUnsafe(`SELECT MAX("${seq.column}") as max_val FROM "${seq.table}"`);
        const maxVal = result[0]?.max_val || 0;

        // Reset sequence to max value + 1
        await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${seq.sequence}" RESTART WITH ${maxVal + 1}`);
        console.log(`   ✅ Reset ${seq.sequence} to ${maxVal + 1}`);
      } catch (error) {
        console.log(`   ⚠️  Could not reset ${seq.sequence}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Failed to reset sequences:', error);
  }
}

// Alternative: Import from JSON
async function importDatabaseFromJSON() {
  try {
    console.log('🚀 Starting database import from JSON...');

    const jsonPath = path.join(process.cwd(), 'exports', 'database_export_2025-11-21.json');

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found: ${jsonPath}`);
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('📊 Importing data in correct order...');

    // Import in dependency order
    if (data.tables.ADMIN) {
      console.log(`📦 Importing ${data.tables.ADMIN.length} admin records...`);
      for (const record of data.tables.ADMIN) {
        await prisma.admin.create({ data: record });
      }
    }

    if (data.tables.CULTURE) {
      console.log(`📦 Importing ${data.tables.CULTURE.length} culture records...`);
      for (const record of data.tables.CULTURE) {
        const { subcultures, cultureAssets, ...cultureData } = record;
        await prisma.culture.create({ data: cultureData });
      }
    }

    if (data.tables.SUBCULTURE) {
      console.log(`📦 Importing ${data.tables.SUBCULTURE.length} subculture records...`);
      for (const record of data.tables.SUBCULTURE) {
        const { culture, domainKodifikasis, subcultureAssets, ...subcultureData } = record;
        await prisma.subculture.create({ data: subcultureData });
      }
    }

    if (data.tables.CODIFICATION_DOMAIN) {
      console.log(`📦 Importing ${data.tables.CODIFICATION_DOMAIN.length} domain records...`);
      for (const record of data.tables.CODIFICATION_DOMAIN) {
        const { subculture, leksikons, ...domainData } = record;
        await prisma.codificationDomain.create({ data: domainData });
      }
    }

    if (data.tables.CONTRIBUTOR) {
      console.log(`📦 Importing ${data.tables.CONTRIBUTOR.length} contributor records...`);
      for (const record of data.tables.CONTRIBUTOR) {
        const { contributorAssets, leksikons, ...contributorData } = record;
        await prisma.contributor.create({ data: contributorData });
      }
    }

    if (data.tables.ASSET) {
      console.log(`📦 Importing ${data.tables.ASSET.length} asset records...`);
      for (const record of data.tables.ASSET) {
        const { explanation, ...assetData } = record;
        await prisma.asset.create({ data: { ...assetData, description: explanation } });
      }
    }

    if (data.tables.REFERENCE) {
      console.log(`📦 Importing ${data.tables.REFERENCE.length} reference records...`);
      for (const record of data.tables.REFERENCE) {
        const { explanation, author, ...referenceData } = record;
        await prisma.reference.create({ data: { ...referenceData, description: explanation, authors: author } });
      }
    }

    if (data.tables.LEXICON) {
      console.log(`📦 Importing ${data.tables.LEXICON.length} lexicon records...`);
      for (const record of data.tables.LEXICON) {
        const { codificationDomain, contributor, lexiconAssets, lexiconReferences, ...lexiconData } = record;
        await prisma.lexicon.create({ data: lexiconData });
      }
    }

    // Import junction tables
    console.log('📦 Importing junction tables...');

    if (data.tables.LEXICON_ASSETS) {
      for (const record of data.tables.LEXICON_ASSETS) {
        const { LEXICON, asset, ...junctionData } = record;
        await prisma.lexiconAsset.create({ data: junctionData });
      }
    }

    if (data.tables.SUBCULTURE_ASSETS) {
      for (const record of data.tables.SUBCULTURE_ASSETS) {
        const { subculture, asset, ...junctionData } = record;
        await prisma.subcultureAsset.create({ data: junctionData });
      }
    }

    if (data.tables.CULTURE_ASSETS) {
      for (const record of data.tables.CULTURE_ASSETS) {
        const { culture, asset, ...junctionData } = record;
        await prisma.cultureAsset.create({ data: junctionData });
      }
    }

    if (data.tables.CONTRIBUTOR_ASSETS) {
      for (const record of data.tables.CONTRIBUTOR_ASSETS) {
        const { contributor, asset, ...junctionData } = record;
        await prisma.contributorAsset.create({ data: junctionData });
      }
    }

    if (data.tables.LEXICON_REFERENCE) {
      for (const record of data.tables.LEXICON_REFERENCE) {
        const { LEXICON, REFERENCE, ...junctionData } = record;
        await prisma.lexiconReference.create({ data: junctionData });
      }
    }

    console.log('✅ JSON import completed successfully!');

  } catch (error) {
    console.error('❌ JSON import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'sql') {
  importDatabaseFromSQL();
} else if (command === 'json') {
  importDatabaseFromJSON();
} else {
  console.log('Usage:');
  console.log('  node import-database.js sql   # Import from SQL file');
  console.log('  node import-database.js json  # Import from JSON file');
}