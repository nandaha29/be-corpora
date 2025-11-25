import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./exports/database_export_2025-11-21.json', 'utf8'));

console.log('=== Checking Junction Table Issues ===\n');

// Check Lexicon Assets
console.log('📊 LEXICON_ASSETS Sample (first 2):');
const lexAssets = data.tables.LEXICON_ASSETS.slice(0, 2);
lexAssets.forEach((asset, i) => {
  console.log(`[${i}] leksikonId: ${asset.leksikonId}, assetId: ${asset.assetId}`);
  console.log(`    Full: ${JSON.stringify(asset)}\n`);
});

// Check Subculture Assets
console.log('\n📊 SUBCULTURE_ASSETS Sample (first 2):');
const subcultureAssets = data.tables.SUBCULTURE_ASSETS.slice(0, 2);
subcultureAssets.forEach((asset, i) => {
  console.log(`[${i}] subcultureId: ${asset.subcultureId}, assetId: ${asset.assetId}`);
  console.log(`    Full: ${JSON.stringify(asset)}\n`);
});

// Check Contributor Assets
console.log('\n📊 CONTRIBUTOR_ASSETS Sample (first 2):');
const contributorAssets = data.tables.CONTRIBUTOR_ASSETS.slice(0, 2);
contributorAssets.forEach((asset, i) => {
  console.log(`[${i}] contributorId: ${asset.contributorId}, assetId: ${asset.assetId}`);
  console.log(`    Full: ${JSON.stringify(asset)}\n`);
});

// Check Lexicon References
console.log('\n📊 LEXICON_REFERENCE Sample (first 2):');
const lexReferences = data.tables.LEXICON_REFERENCE.slice(0, 2);
lexReferences.forEach((ref, i) => {
  console.log(`[${i}] leksikonId: ${ref.leksikonId}, referensiId: ${ref.referensiId}`);
  console.log(`    Full: ${JSON.stringify(ref)}\n`);
});

// Check if asset IDs exist in database
console.log('\n📊 Checking ASSET data:');
const assets = data.tables.ASSET.slice(0, 2);
assets.forEach((asset, i) => {
  console.log(`[${i}] assetId: ${asset.assetId}`);
});

console.log('\n📊 Checking REFERENCE data:');
const references = data.tables.REFERENCE.slice(0, 2);
references.forEach((ref, i) => {
  console.log(`[${i}] referensiId: ${ref.referensiId || 'undefined'}`);
});
