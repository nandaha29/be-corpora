import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCultures() {
  try {
    const cultures = await prisma.culture.findMany();
    console.log(cultures.map(c => ({ id: c.cultureId, name: c.cultureName })));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCultures();