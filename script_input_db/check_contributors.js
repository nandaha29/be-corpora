import { PrismaClient } from '@prisma/client';

async function checkContributors() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.contributor.count();
    console.log('Total contributors:', count);
    if (count > 0) {
      const contributors = await prisma.contributor.findMany();
      console.log('Contributors:', contributors);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContributors();