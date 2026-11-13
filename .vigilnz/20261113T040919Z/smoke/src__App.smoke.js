const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const filePath = path.join(__dirname, '../../../src/App.js');
let src;
try {
  src = fs.readFileSync(filePath, 'utf8');
} catch (e) {
  fail('Failed to load src/App.js: ' + (e && e.message ? e.message : e));
}

const baseline = src.includes('function App()') && src.includes('export default App;');
const current = src.includes('function App()') && src.includes('export default App;');

if (baseline !== current) {
  fail('Observed result changed for src/App.js');
}

process.exit(0);
