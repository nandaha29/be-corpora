import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkCounts() {
  const lexiconCount = await prisma.lexicon.count();
  const assetCount = await prisma.asset.count();
  const lexiconAssetCount = await prisma.lexiconAsset.count();
  
  console.log("Database counts:");
  console.log("  Lexicons:", lexiconCount);
  console.log("  Assets:", assetCount);
  console.log("  LexiconAssets:", lexiconAssetCount);
  
  // Get some sample lexicons
  const sampleLexicons = await prisma.lexicon.findMany({ take: 5, select: { lexiconId: true, lexiconWord: true } });
  console.log("\nSample lexicons:", sampleLexicons);
  
  // Get some sample assets
  const sampleAssets = await prisma.asset.findMany({ take: 5, select: { assetId: true, fileName: true, fileType: true } });
  console.log("\nSample assets:", sampleAssets);
  
  await prisma.$disconnect();
}

checkCounts();
