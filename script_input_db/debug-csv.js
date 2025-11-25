import fs from 'fs';

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
        current += '"';
        i += 2;
        continue;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
    i++;
  }

  result.push(current);
  return result;
}

const lines = fs.readFileSync('./exports/subculture.csv', 'utf8').split('\n');
console.log('Header:', lines[0]);
console.log('\n--- Parsing first data line ---');
const fields = parseCSVLine(lines[1]);

console.log(`Total fields: ${fields.length}`);
fields.forEach((field, i) => {
  const preview = field.substring(0, 80).replace(/\n/g, '\\n');
  console.log(`[${i}] (len:${field.length}): "${preview}${field.length > 80 ? '...' : ''}"`);
});
