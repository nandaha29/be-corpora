import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./exports/database_export_2025-11-21.json', 'utf8'));
const tables = Object.keys(data.tables);
console.log('Available tables:');
tables.forEach(t => {
  const count = Array.isArray(data.tables[t]) ? data.tables[t].length : 'N/A';
  console.log(`  ${t}: ${count} records`);
});
