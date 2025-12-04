import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importContributors() {
  try {
    const data = JSON.parse(fs.readFileSync('exports/database_export_2025-12-04.json', 'utf8'));
    console.log('Importing CONTRIBUTOR...');
    let success = 0;
    for (const record of data.tables.CONTRIBUTOR) {
      try {
        await prisma.contributor.create({ data: record });
        success++;
      } catch (error) {
        console.log('Failed:', record.contributorId, error.message);
      }
    }
    console.log('CONTRIBUTOR imported:', success);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importContributors();