import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const adminCount = await prisma.admin.count();
    const cultureCount = await prisma.culture.count();
    const contributorCount = await prisma.contributor.count();
    const subcultureCount = await prisma.subculture.count();
    const domainCount = await prisma.codificationDomain.count();
    const lexiconCount = await prisma.lexicon.count();

    console.log('Admins:', adminCount);
    console.log('Cultures:', cultureCount);
    console.log('Contributors:', contributorCount);
    console.log('Subcultures:', subcultureCount);
    console.log('CodificationDomains:', domainCount);
    console.log('Lexicons:', lexiconCount);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();