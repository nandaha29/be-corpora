import { PrismaClient } from '@prisma/client';
import fs from 'fs';

async function backup() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting backup...');

    const references = await prisma.reference.findMany({
      include: {
        lexiconReferences: true,
        subcultureReferences: true,
        cultureReferences: true
      }
    });

    const backupData = {
      timestamp: new Date().toISOString(),
      totalReferences: references.length,
      data: references
    };

    fs.writeFileSync('reference-backup-2025-12-08.json', JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup created: reference-backup-2025-12-08.json`);
    console.log(`📊 Total references backed up: ${references.length}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

backup();