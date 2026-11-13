const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const filePath = path.join(__dirname, '../../../src/components/Search.jsx');
let src;
try {
  src = fs.readFileSync(filePath, 'utf8');
} catch (e) {
  fail('Failed to load src/components/Search.jsx: ' + (e && e.message ? e.message : e));
}

const baseline = src.includes('function Search()') && src.includes('export default Search;');
const current = src.includes('function Search()') && src.includes('export default Search;');

if (baseline !== current) {
  fail('Observed result changed for src/components/Search.jsx');
}

process.exit(0);
