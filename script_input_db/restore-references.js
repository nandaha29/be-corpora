import { PrismaClient } from '@prisma/client';
import fs from 'fs';

async function restoreReferences() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting data restoration...');

    // Read backup file
    const backupData = JSON.parse(fs.readFileSync('reference-backup-2025-12-08.json', 'utf8'));
    console.log(`Found ${backupData.totalReferences} references in backup`);

    // Process each reference
    for (const ref of backupData.data) {
      try {
        // Map old citationNote to new referenceRole
        let referenceRole = null;
        if (ref.citationNote) {
          // Map old enum values to new ones
          switch (ref.citationNote) {
            case 'DIRECT_QUOTE':
            case 'PARAPHRASE':
            case 'INTERPRETATION':
              referenceRole = 'PRIMARY_SOURCE';
              break;
            case 'SECONDARY_SOURCE':
            case 'GENERAL_REFERENCE':
              referenceRole = 'SECONDARY_SOURCE';
              break;
            case 'FIELD_OBSERVATION':
            case 'ORAL_TRADITION':
              referenceRole = 'SUPPORTING';
              break;
            default:
              referenceRole = 'SUPPORTING';
          }
        }

        // Update the reference with new field
        await prisma.reference.update({
          where: { referenceId: ref.referenceId },
          data: {
            referenceRole: referenceRole,
            // Remove old citationNote field if it exists
          }
        });

        console.log(`✅ Updated reference ${ref.referenceId}: ${ref.title}`);
      } catch (error) {
        console.error(`❌ Failed to update reference ${ref.referenceId}:`, error);
      }
    }

    console.log('✅ Data restoration completed');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Restoration failed:', error);
    process.exit(1);
  }
}

restoreReferences();