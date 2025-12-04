import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importCodificationDomains() {
  try {
    const data = JSON.parse(fs.readFileSync('exports/database_export_2025-12-04.json', 'utf8'));
    console.log('Importing CODIFICATION_DOMAIN...');
    let success = 0;
    for (const record of data.tables.CODIFICATION_DOMAIN) {
      try {
        const { domainId, subculture, lexicons, ...dataWithoutId } = record;
        await prisma.codificationDomain.create({ data: dataWithoutId });
        success++;
      } catch (error) {
        console.log('Failed:', record.domainId, error.message);
      }
    }
    console.log('CODIFICATION_DOMAIN imported:', success);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importCodificationDomains();