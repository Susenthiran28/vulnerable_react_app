const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const filePath = path.join(__dirname, '../../../src/components/Auth.jsx');
let src;
try {
  src = fs.readFileSync(filePath, 'utf8');
} catch (e) {
  fail('Failed to load src/components/Auth.jsx: ' + (e && e.message ? e.message : e));
}

const baseline = src.includes('function Auth()') && src.includes('export default Auth;');
const current = src.includes('function Auth()') && src.includes('export default Auth;');

if (baseline !== current) {
  fail('Observed result changed for src/components/Auth.jsx');
}

process.exit(0);
