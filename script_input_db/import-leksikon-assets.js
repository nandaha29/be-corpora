import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importLeksikonAssets() {
  const csvPath = path.join(__dirname, "../exports/leksikon_assets.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.error("CSV file not found:", csvPath);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter(line => line.trim());
  
  // Skip header
  const header = lines[0];
  console.log("Header:", header);
  
  const dataLines = lines.slice(1);
  console.log(`Found ${dataLines.length} records to import`);

  // Build a map of lexicon slug to lexiconId
  const allLexicons = await prisma.lexicon.findMany({
    select: { lexiconId: true, slug: true, lexiconWord: true }
  });
  const lexiconBySlug = new Map();
  const lexiconByWord = new Map();
  for (const lex of allLexicons) {
    if (lex.slug) lexiconBySlug.set(lex.slug.toLowerCase(), lex.lexiconId);
    if (lex.lexiconWord) lexiconByWord.set(lex.lexiconWord.toLowerCase(), lex.lexiconId);
  }
  console.log(`Loaded ${allLexicons.length} lexicons for matching`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const line of dataLines) {
    try {
      // Parse CSV - extract basic fields first
      const basicMatch = line.match(/^"(\d+)","(\d+)","([^"]+)"/);
      
      if (!basicMatch) {
        console.log("Could not parse basic fields:", line.substring(0, 50));
        skipped++;
        continue;
      }

      const csvLexiconId = parseInt(basicMatch[1]);
      const assetId = parseInt(basicMatch[2]);
      const assetRole = basicMatch[3];
      
      // The CSV uses "" for escaped quotes, so "slug" appears as ""slug""
      // Extract slug from the JSON blob
      const slugMatch = line.match(/""slug"":""([^"]+)""/);
      const lexiconSlug = slugMatch ? slugMatch[1] : null;
      
      // Also try to extract lexicon name/word
      const wordMatch = line.match(/""lexicon(?:Name|Word)"":""([^"]+)""/i);
      const lexiconWord = wordMatch ? wordMatch[1] : null;
      
      // Debug first few lines
      if (imported + skipped + errors < 3) {
        console.log(`Debug: assetRole=${assetRole}, slug=${lexiconSlug}, word=${lexiconWord}`);
      }

      // Validate assetRole is valid
      const validRoles = ["GALLERY", "PRONUNCIATION", "VIDEO_DEMO", "MODEL_3D"];
      if (!validRoles.includes(assetRole)) {
        console.log(`Invalid assetRole: ${assetRole} for csvLexiconId: ${csvLexiconId}, assetId: ${assetId}`);
        skipped++;
        continue;
      }

      // Find lexicon by slug or word
      let actualLexiconId = null;
      if (lexiconSlug) {
        actualLexiconId = lexiconBySlug.get(lexiconSlug.toLowerCase());
      }
      if (!actualLexiconId && lexiconWord) {
        actualLexiconId = lexiconByWord.get(lexiconWord.toLowerCase());
      }
      
      if (!actualLexiconId) {
        console.log(`Lexicon not found for slug: ${lexiconSlug}, word: ${lexiconWord}`);
        skipped++;
        continue;
      }

      // Check if asset exists
      const asset = await prisma.asset.findUnique({
        where: { assetId }
      });
      if (!asset) {
        console.log(`Asset not found: ${assetId}`);
        skipped++;
        continue;
      }

      // Upsert the lexicon asset relation
      await prisma.lexiconAsset.upsert({
        where: {
          lexiconId_assetId: {
            lexiconId: actualLexiconId,
            assetId
          }
        },
        update: {
          assetRole
        },
        create: {
          lexiconId: actualLexiconId,
          assetId,
          assetRole
        }
      });

      imported++;
      console.log(`Imported: lexiconId=${actualLexiconId} (slug: ${lexiconSlug}), assetId=${assetId}, role=${assetRole}`);

    } catch (error) {
      console.error("Error processing line:", error.message);
      errors++;
    }
  }

  console.log("\n=== Import Summary ===");
  console.log(`Total records: ${dataLines.length}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

importLeksikonAssets()
  .then(() => {
    console.log("Import completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
