import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.lexiconAsset.count();
  console.log('LexiconAssets count:', count);

  // Sample of imported records
  const samples = await prisma.lexiconAsset.findMany({
    take: 5,
    include: {
      lexicon: {
        select: { slug: true, lexiconWord: true }
      },
      asset: {
        select: { fileName: true, fileType: true }
      }
    }
  });
  
  console.log('\nSample records:');
  samples.forEach(s => {
    console.log(`- ${s.lexicon.lexiconWord} (${s.lexicon.slug}): ${s.assetRole} - ${s.asset.fileName}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
