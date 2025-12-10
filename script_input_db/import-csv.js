import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

// Helper function to parse dates safely
function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') {
    return new Date();
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date: ${dateStr}, using current date`);
    return new Date();
  }

  return date;
}

// Function to properly parse CSV line with quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
    i++;
  }

  // Add the last field
  result.push(current);

  return result;
}

// Function to parse subculture CSV line (handles JSON fields at the end)
function parseSubcultureLine(line) {
  // Remove outer quotes
  let content = line;
  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }

  // Split by '","' to get individual fields
  const rawFields = content.split('","');

  // Clean up quotes and handle escaped quotes
  const fields = rawFields.map(field => field.replace(/""/g, '"'));

  return fields;
}

async function resetDatabase() {
  console.log('🗑️  Resetting database...');

  // Delete junction tables first
  await prisma.lexiconReference.deleteMany();
  await prisma.subcultureReference.deleteMany();
  await prisma.cultureReference.deleteMany();
  await prisma.lexiconAsset.deleteMany();
  await prisma.subcultureAsset.deleteMany();
  await prisma.cultureAsset.deleteMany();
  await prisma.contributorAsset.deleteMany();
  await prisma.aboutReference.deleteMany();

  // Delete main tables
  await prisma.lexicon.deleteMany();
  await prisma.codificationDomain.deleteMany();
  await prisma.subculture.deleteMany();
  await prisma.culture.deleteMany();
  await prisma.reference.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.contributor.deleteMany();
  await prisma.admin.deleteMany();

  console.log('✅ Database reset completed');
}

async function importFromCSV() {
  try {
    console.log('🚀 Starting CSV database import...');

    const exportDir = path.join(process.cwd(), 'exports');

    // Import Admin
    console.log('📊 Importing Admin data...');
    const adminPath = path.join(exportDir, 'admin.csv');
    if (fs.existsSync(adminPath)) {
      const adminData = fs.readFileSync(adminPath, 'utf8')
        .split('\n')
        .slice(1) // Skip header
        .filter(line => line.trim())
        .map(line => {
          const [adminId, username, email, password, role, isActive, createdAt, updatedAt] = line.split(',');
          return {
            adminId: parseInt(adminId.replace(/"/g, '')),
            username: username.replace(/"/g, ''),
            email: email.replace(/"/g, ''),
            password: password.replace(/"/g, ''),
            role: role.replace(/"/g, ''),
            isActive: isActive.replace(/"/g, '') === 'true',
            createdAt: new Date(createdAt.replace(/"/g, '').replace(/"""|""""/g, '')),
            updatedAt: new Date(updatedAt.replace(/"/g, '').replace(/"""|""""/g, ''))
          };
        });

      for (const admin of adminData) {
        await prisma.admin.create({ data: admin });
      }
      console.log(`✅ Imported ${adminData.length} admin records`);
    }

    // Import Contributor
    console.log('📊 Importing Contributor data...');
    const contributorPath = path.join(exportDir, 'contributor.csv');
    if (fs.existsSync(contributorPath)) {
      const contributorData = fs.readFileSync(contributorPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [contributorId, contributorName, institution, email, expertiseArea, contactInfo, isCoordinator, coordinatorStatus, registeredAt, displayPriorityStatus] = line.split(',');
          return {
            contributorId: parseInt(contributorId.replace(/"/g, '')),
            contributorName: contributorName.replace(/"/g, ''),
            institution: institution.replace(/"/g, ''),
            email: email.replace(/"/g, ''),
            expertiseArea: expertiseArea.replace(/"/g, ''),
            contactInfo: contactInfo.replace(/"/g, ''),
            isCoordinator: isCoordinator.replace(/"/g, '') === 'true',
            coordinatorStatus: coordinatorStatus.replace(/"/g, ''),
            registeredAt: new Date(registeredAt.replace(/"/g, '').replace(/"""|""""/g, '')),
            displayPriorityStatus: displayPriorityStatus.replace(/"/g, '') || null
          };
        });

      for (const contributor of contributorData) {
        await prisma.contributor.create({ data: contributor });
      }
      console.log(`✅ Imported ${contributorData.length} contributor records`);
    }

    // Import Asset
    console.log('📊 Importing Asset data...');
    const assetPath = path.join(exportDir, 'asset.csv');
    if (fs.existsSync(assetPath)) {
      const assetData = fs.readFileSync(assetPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [assetId, fileName, fileType, description, url, fileSize, hashChecksum, metadataJson, status, createdAt, updatedAt] = line.split(',');
          return {
            assetId: parseInt(assetId.replace(/"/g, '')),
            fileName: fileName.replace(/"/g, ''),
            fileType: fileType.replace(/"/g, ''),
            description: description.replace(/"/g, '') || null,
            url: url.replace(/"/g, ''),
            fileSize: fileSize.replace(/"/g, '') || null,
            hashChecksum: hashChecksum.replace(/"/g, '') || null,
            metadataJson: metadataJson.replace(/"/g, '') || null,
            status: status.replace(/"/g, ''),
            createdAt: new Date(createdAt.replace(/"/g, '').replace(/"""|""""/g, '')),
            updatedAt: new Date(updatedAt.replace(/"/g, '').replace(/"""|""""/g, ''))
          };
        });

      for (const asset of assetData) {
        await prisma.asset.create({ data: asset });
      }
      console.log(`✅ Imported ${assetData.length} asset records`);
    }

    // Import Reference
    console.log('📊 Importing Reference data...');
    const referencePath = path.join(exportDir, 'referensi.csv');
    if (fs.existsSync(referencePath)) {
      const lines = fs.readFileSync(referencePath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim());

      const referenceData = [];
      for (const line of lines) {
        try {
          const fields = parseCSVLine(line);
          if (fields.length >= 11) {
            const referenceId = fields[0].replace(/"/g, '');
            const title = fields[1].replace(/"/g, '');
            const referenceType = fields[2].replace(/"/g, '');
            const description = fields[3].replace(/"/g, '');
            const url = fields[4].replace(/"/g, '');
            const authors = fields[5].replace(/"/g, '');
            const publicationYear = fields[6].replace(/"/g, '');
            const topicCategory = fields[7].replace(/"/g, '');
            const status = fields[8].replace(/"/g, '');
            const createdAt = fields[9].replace(/"/g, '').replace(/"""|""""/g, '');
            const updatedAt = fields[10].replace(/"/g, '').replace(/"""|""""/g, '');

            const referenceTypeMap = {
              'BUKU': 'BOOK',
              'JURNAL': 'JOURNAL',
              'ARTIKEL': 'ARTICLE',
              'WEBSITE': 'WEBSITE',
              'LAPORAN': 'REPORT',
              'TESIS': 'THESIS',
              'DISERTASI': 'DISSERTATION',
              'CATATAN_LAPANGAN': 'FIELD_NOTE'
            };

            referenceData.push({
              referenceId: parseInt(referenceId),
              title,
              referenceType: referenceTypeMap[referenceType] || 'BOOK',
              description,
              url,
              authors,
              publicationYear,
              topicCategory,
              status,
              createdAt: new Date(createdAt.replace(/Invalid Date/, '2025-01-01T00:00:00.000Z')),
              updatedAt: new Date(updatedAt.replace(/Invalid Date/, '2025-01-01T00:00:00.000Z'))
            });
          }
        } catch (error) {
          console.log(`⚠️  Skipping invalid reference line: ${line.substring(0, 50)}...`);
        }
      }

      for (const reference of referenceData) {
        await prisma.reference.create({ data: reference });
      }
      console.log(`✅ Imported ${referenceData.length} reference records`);
    }

    // Import Culture
    console.log('📊 Importing Culture data...');
    const culturePath = path.join(exportDir, 'culture.csv');
    if (fs.existsSync(culturePath)) {
      const cultureData = [];
      const cultureLines = fs.readFileSync(culturePath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim());

      for (const line of cultureLines) {
        try {
          // Parse CSV line properly handling quoted fields
          const fields = parseCSVLine(line);
          if (fields.length < 16) continue;

          const cultureId = fields[0].replace(/"/g, '');
          const slug = fields[1].replace(/"/g, '');
          const cultureName = fields[2].replace(/"/g, '');
          const originIsland = fields[3].replace(/"/g, '');
          const province = fields[4].replace(/"/g, '');
          const cityRegion = fields[5].replace(/"/g, '');
          const classification = fields[6].replace(/"/g, '') || null;
          const characteristics = fields[7].replace(/"/g, '') || null;
          const conservationStatus = fields[8].replace(/"/g, '');
          const latitude = fields[9].replace(/"/g, '') || null;
          const longitude = fields[10].replace(/"/g, '') || null;
          const status = fields[11].replace(/"/g, '');
          const createdAt = fields[12].replace(/"/g, '').replace(/"""|""""/g, '');
          const updatedAt = fields[13].replace(/"/g, '').replace(/"""|""""/g, '');

          cultureData.push({
            cultureId: parseInt(cultureId),
            slug,
            cultureName,
            originIsland,
            province,
            cityRegion,
            classification,
            characteristics,
            conservationStatus,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            status,
            createdAt: new Date(createdAt.replace(/Invalid Date/, '2025-01-01T00:00:00.000Z')),
            updatedAt: new Date(updatedAt.replace(/Invalid Date/, '2025-01-01T00:00:00.000Z'))
          });
        } catch (error) {
          console.log(`⚠️  Skipping invalid culture line: ${line.substring(0, 50)}...`);
        }
      }

      for (const culture of cultureData) {
        await prisma.culture.create({ data: culture });
      }
      console.log(`✅ Imported ${cultureData.length} culture records`);
    }

    // Import Subculture
    console.log('📊 Importing Subculture data...');
    const subculturePath = path.join(exportDir, 'subculture.csv');
    if (fs.existsSync(subculturePath)) {
      await new Promise((resolve, reject) => {
        const subcultureData = [];
        fs.createReadStream(subculturePath)
          .pipe(csv())
          .on('data', (row) => {
            // Only take the first 12 fields
            const fields = Object.keys(row);
            const limitedRow = {};
            for (let i = 0; i < Math.min(12, fields.length); i++) {
              limitedRow[fields[i]] = row[fields[i]];
            }
            
            subcultureData.push({
              subcultureId: parseInt(limitedRow.subcultureId),
              slug: limitedRow.slug,
              subcultureName: limitedRow.subcultureName,
              traditionalGreeting: limitedRow.traditionalGreeting,
              greetingMeaning: limitedRow.greetingMeaning,
              explanation: limitedRow.explanation,
              cultureId: parseInt(limitedRow.cultureId),
              status: limitedRow.status,
              displayPriorityStatus: limitedRow.displayPriorityStatus || 'LOW',
              conservationStatus: limitedRow.conservationStatus,
              createdAt: parseDate(limitedRow.createdAt),
              updatedAt: parseDate(limitedRow.updatedAt)
            });
          })
          .on('end', async () => {
            console.log(`Processing ${subcultureData.length} subculture records...`);
            for (const subculture of subcultureData) {
              try {
                await prisma.subculture.create({
                  data: {
                    subcultureId: subculture.subcultureId,
                    slug: subculture.slug,
                    subcultureName: subculture.subcultureName,
                    traditionalGreeting: subculture.traditionalGreeting,
                    greetingMeaning: subculture.greetingMeaning,
                    explanation: subculture.explanation,
                    cultureId: subculture.cultureId,
                    status: subculture.status,
                    displayPriorityStatus: subculture.displayPriorityStatus,
                    conservationStatus: subculture.conservationStatus,
                    createdAt: subculture.createdAt,
                    updatedAt: subculture.updatedAt
                  }
                });
                console.log(`Imported subculture: ${subculture.subcultureName}`);
              } catch (error) {
                console.error(`Failed to import subculture ${subculture.subcultureName}:`, error.message);
              }
            }
            console.log('Subculture import completed.');
            resolve();
          })
          .on('error', reject);
      });
    }

      // Import Domain Kodifikasi
    console.log('📊 Importing Domain Kodifikasi data...');
    const domainPath = path.join(exportDir, 'domain_kodifikasi.csv');
    if (fs.existsSync(domainPath)) {
      const domainData = [];
      fs.createReadStream(domainPath)
        .pipe(csv())
        .on('data', (row) => {
          // Only take the first 8 fields
          const fields = Object.keys(row);
          const limitedRow = {};
          for (let i = 0; i < Math.min(8, fields.length); i++) {
            limitedRow[fields[i]] = row[fields[i]];
          }
          
          domainData.push({
            domainId: parseInt(limitedRow.domainId),
            code: limitedRow.code,
            domainName: limitedRow.domainName,
            explanation: limitedRow.explanation,
            subcultureId: parseInt(limitedRow.subcultureId),
            status: limitedRow.status,
            createdAt: parseDate(limitedRow.createdAt),
            updatedAt: parseDate(limitedRow.updatedAt)
          });
        })
        .on('end', async () => {
          console.log(`Processing ${domainData.length} domain records...`);
          for (const domain of domainData) {
            try {
              await prisma.codificationDomain.create({ data: domain });
            } catch (error) {
              console.warn(`⚠️  Skipped domain: ${error.message}`);
            }
          }
          console.log(`✅ Imported ${domainData.length} domain records`);
        })
        .on('error', (error) => {
          console.error('Error importing domains:', error);
        });
    }

    console.log('DEBUG: About to start lexicon import');
    // Import Lexicon
    console.log('📊 Importing Lexicon data...');
    console.log('DEBUG: Lexicon section reached');
    const lexiconPath = path.join(exportDir, 'leksikon_clean.csv');
    if (fs.existsSync(lexiconPath)) {
      try {
        const lexiconData = [];

        // Use csv-parser for the cleaned CSV
        const stream = fs.createReadStream(lexiconPath)
          .pipe(csv())
          .on('data', (data) => {
            lexiconData.push({
              lexiconId: parseInt(data.lexiconId),
              slug: data.slug,
              lexiconWord: data.lexiconWord,
              ipaInternationalPhoneticAlphabet: data.ipaInternationalPhoneticAlphabet,
              transliteration: data.transliteration,
              etymologicalMeaning: data.etymologicalMeaning,
              culturalMeaning: data.culturalMeaning,
              commonMeaning: data.commonMeaning,
              translation: data.translation,
              variant: data.variant || null,
              variantTranslations: data.variantTranslations || null,
              otherDescription: data.otherDescription || null,
              domainId: parseInt(data.domainId),
              preservationStatus: data.preservationStatus,
              contributorId: parseInt(data.contributorId),
              status: data.status,
              createdAt: parseDate(data.createdAt),
              updatedAt: parseDate(data.updatedAt)
            });
          });

        // Wait for the stream to finish
        await new Promise((resolve, reject) => {
          stream.on('end', resolve);
          stream.on('error', reject);
        });

        console.log(`Processing ${lexiconData.length} lexicon records...`);
        for (const lexicon of lexiconData) {
          try {
            await prisma.lexicon.create({
              data: {
                lexiconId: lexicon.lexiconId,
                slug: lexicon.slug,
                lexiconWord: lexicon.lexiconWord,
                ipaInternationalPhoneticAlphabet: lexicon.ipaInternationalPhoneticAlphabet,
                transliteration: lexicon.transliteration,
                etymologicalMeaning: lexicon.etymologicalMeaning,
                culturalMeaning: lexicon.culturalMeaning,
                commonMeaning: lexicon.commonMeaning,
                translation: lexicon.translation,
                variant: lexicon.variant,
                variantTranslations: lexicon.variantTranslations,
                otherDescription: lexicon.otherDescription,
                domainId: lexicon.domainId,
                preservationStatus: lexicon.preservationStatus,
                contributorId: lexicon.contributorId,
                status: lexicon.status,
                createdAt: lexicon.createdAt,
                updatedAt: lexicon.updatedAt
              }
            });
            console.log(`Imported lexicon: ${lexicon.lexiconWord}`);
          } catch (error) {
            console.error(`Failed to import lexicon ${lexicon.lexiconWord}:`, error);
          }
        }
        console.log('Lexicon import completed.');
      } catch (error) {
        console.error('Error in lexicon import:', error);
      }
    }    // Import junction tables
    console.log('📊 Importing junction tables...');

    // Lexicon Assets
    const lexiconAssetsPath = path.join(exportDir, 'leksikon_assets.csv');
    if (fs.existsSync(lexiconAssetsPath)) {
      const lexiconAssetsData = fs.readFileSync(lexiconAssetsPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [lexiconId, assetId, assetRole, createdAt] = line.split(',');
          return {
            lexiconId: parseInt(lexiconId.replace(/"/g, '')),
            assetId: parseInt(assetId.replace(/"/g, '')),
            assetRole: assetRole.replace(/"/g, ''),
            createdAt: new Date(createdAt.replace(/"/g, '').replace(/"""|""""/g, ''))
          };
        });

      for (const item of lexiconAssetsData) {
        try {
          await prisma.lexiconAsset.create({ data: item });
        } catch (error) {
          console.warn(`⚠️  Skipped lexicon asset: ${error.message}`);
        }
      }
      console.log(`✅ Imported ${lexiconAssetsData.length} lexicon asset records`);
    }

    // Subculture Assets
    const subcultureAssetsPath = path.join(exportDir, 'subculture_assets.csv');
    if (fs.existsSync(subcultureAssetsPath)) {
      const subcultureAssetsData = fs.readFileSync(subcultureAssetsPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [subcultureId, assetId, assetRole, createdAt] = line.split(',');
          return {
            subcultureId: parseInt(subcultureId.replace(/"/g, '')),
            assetId: parseInt(assetId.replace(/"/g, '')),
            assetRole: assetRole.replace(/"/g, ''),
            createdAt: new Date(createdAt.replace(/"/g, '').replace(/"""|""""/g, ''))
          };
        });

      for (const item of subcultureAssetsData) {
        try {
          await prisma.subcultureAsset.create({ data: item });
        } catch (error) {
          console.warn(`⚠️  Skipped subculture asset: ${error.message}`);
        }
      }
      console.log(`✅ Imported ${subcultureAssetsData.length} subculture asset records`);
    }

    // Culture Assets
    const cultureAssetsPath = path.join(exportDir, 'culture_assets.csv');
    if (fs.existsSync(cultureAssetsPath)) {
      const cultureAssetsData = fs.readFileSync(cultureAssetsPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [cultureId, assetId, assetRole, createdAt] = line.split(',');
          return {
            cultureId: parseInt(cultureId.replace(/"/g, '')),
            assetId: parseInt(assetId.replace(/"/g, '')),
            assetRole: assetRole.replace(/"/g, ''),
            createdAt: new Date(createdAt.replace(/"/g, '').replace(/"""|""""/g, ''))
          };
        });

      for (const item of cultureAssetsData) {
        try {
          await prisma.cultureAsset.create({ data: item });
        } catch (error) {
          console.warn(`⚠️  Skipped culture asset: ${error.message}`);
        }
      }
      console.log(`✅ Imported ${cultureAssetsData.length} culture asset records`);
    }

    // Contributor Assets
    const contributorAssetsPath = path.join(exportDir, 'contributor_assets.csv');
    if (fs.existsSync(contributorAssetsPath)) {
      const contributorAssetsData = fs.readFileSync(contributorAssetsPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [contributorId, assetId, assetRole, createdAt] = line.split(',');
          return {
            contributorId: parseInt(contributorId.replace(/"/g, '')),
            assetId: parseInt(assetId.replace(/"/g, '')),
            assetNote: assetRole.replace(/"/g, ''), // Map assetRole to assetNote
            createdAt: new Date(createdAt.replace(/"/g, '').replace(/"""|""""/g, ''))
          };
        });

      for (const item of contributorAssetsData) {
        try {
          await prisma.contributorAsset.create({ data: item });
        } catch (error) {
          console.warn(`⚠️  Skipped contributor asset: ${error.message}`);
        }
      }
      console.log(`✅ Imported ${contributorAssetsData.length} contributor asset records`);
    }

    // Lexicon References
    const lexiconReferencesPath = path.join(exportDir, 'leksikon_referensi.csv');
    if (fs.existsSync(lexiconReferencesPath)) {
      const lexiconReferencesData = fs.readFileSync(lexiconReferencesPath, 'utf8')
        .split('\n')
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [lexiconId, referenceId, referenceRole, displayOrder, createdAt] = line.split(',');
          return {
            lexiconId: parseInt(lexiconId.replace(/"/g, '')),
            referenceId: parseInt(referenceId.replace(/"/g, '')),
            referenceRole: referenceRole.replace(/"/g, '') || null,
            displayOrder: displayOrder.replace(/"/g, '') ? parseInt(displayOrder.replace(/"/g, '')) : 0,
            createdAt: new Date(createdAt.replace(/"/g, '').replace(/"""|""""/g, ''))
          };
        });

      for (const item of lexiconReferencesData) {
        try {
          await prisma.lexiconReference.create({ data: item });
        } catch (error) {
          console.warn(`⚠️  Skipped lexicon reference: ${error.message}`);
        }
      }
      console.log(`✅ Imported ${lexiconReferencesData.length} lexicon reference records`);
    }
    console.log('✅ CSV import completed successfully!');

  } catch (error) {
    console.error('❌ CSV import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
async function main() {
  await resetDatabase();
  await importFromCSV();
}

main();