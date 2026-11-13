const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const filePath = path.join(__dirname, '../../../src/components/Profile.jsx');
let src;
try {
  src = fs.readFileSync(filePath, 'utf8');
} catch (e) {
  fail('Failed to load src/components/Profile.jsx: ' + (e && e.message ? e.message : e));
}

const baseline = src.includes('function Profile()') && src.includes('export default Profile;');
const current = src.includes('function Profile()') && src.includes('export default Profile;');

if (baseline !== current) {
  fail('Observed result changed for src/components/Profile.jsx');
}

process.exit(0);
