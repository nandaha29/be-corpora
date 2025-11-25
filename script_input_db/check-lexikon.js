import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./exports/database_export_2025-11-21.json', 'utf8'));
const lexikons = data.tables.LEXICON.slice(0, 2);

console.log('Sample Lexikon records:');
lexikons.forEach((lex, i) => {
  console.log(`\n[${i}]`);
  console.log(JSON.stringify(lex, null, 2).substring(0, 500));
});
