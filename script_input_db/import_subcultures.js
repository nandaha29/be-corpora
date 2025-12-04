import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importSubcultures() {
  try {
    const data = JSON.parse(fs.readFileSync('exports/database_export_2025-12-04.json', 'utf8'));
    console.log('Importing SUBCULTURE...');
    let success = 0;
    for (const record of data.tables.SUBCULTURE) {
      try {
        const { culture, codificationDomains, subcultureAssets, ...subcultureData } = record;
        await prisma.subculture.create({ data: subcultureData });
        success++;
      } catch (error) {
        console.log('Failed:', record.subcultureId, error.message);
      }
    }
    console.log('SUBCULTURE imported:', success);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importSubcultures();