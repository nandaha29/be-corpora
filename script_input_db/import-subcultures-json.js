import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importSubculturesFromJSON() {
  try {
    console.log('📊 Importing Subculture data from JSON...');
    
    // Read the JSON export
    const jsonPath = './exports/database_export_2025-11-21.json';
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    const subcultures = jsonData.tables.SUBCULTURE;
    
    console.log(`Found ${subcultures.length} subcultures in JSON`);
    
    for (const sub of subcultures) {
      try {
        await prisma.subculture.create({
          data: {
            subcultureId: sub.subcultureId,
            slug: sub.slug,
            subcultureName: sub.subcultureName,
            traditionalGreeting: sub.traditionalGreeting,
            greetingMeaning: sub.greetingMeaning,
            explanation: sub.explanation,
            cultureId: sub.cultureId,
            status: sub.status,
            conservationStatus: sub.conservationStatus,
            displayPriorityStatus: sub.displayPriorityStatus,
            createdAt: new Date(sub.createdAt),
            updatedAt: new Date(sub.updatedAt)
          }
        });
      } catch (error) {
        console.error(`Failed to create subculture ${sub.subcultureId}:`, error.message);
      }
    }
    
    console.log(`✅ Imported ${subcultures.length} subculture records`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importSubculturesFromJSON();
