import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLexicons() {
  try {
    const count = await prisma.lexicon.count();
    console.log('Total lexicons:', count);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLexicons();