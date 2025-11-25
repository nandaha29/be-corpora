import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  // delete junction tables first
  await prisma.lexiconReference.deleteMany();
  await prisma.lexiconAsset.deleteMany();
  await prisma.subcultureAsset.deleteMany();
  await prisma.cultureAsset.deleteMany();
  await prisma.contributorAsset.deleteMany();
  // then main tables
  await prisma.lexicon.deleteMany();
  await prisma.codificationDomain.deleteMany();
  await prisma.subculture.deleteMany();
  await prisma.culture.deleteMany();
  await prisma.reference.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.contributor.deleteMany();
  await prisma.admin.deleteMany();
  console.log('All data deleted');
  await prisma.$disconnect();
}

check();