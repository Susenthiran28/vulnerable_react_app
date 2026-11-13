const path = require('path');

const targetPath = path.resolve(__dirname, '../../../backend/server.js');

let loaded;
try {
  loaded = require(targetPath);
} catch (e) {
  console.error('Failed to load module:', e && e.stack ? e.stack : e);
  process.exit(1);
}

const observedType = typeof loaded;

if (observedType !== 'object') {
  console.error(`Unexpected export type. Expected current observed type "object", got "${observedType}"`);
  process.exit(1);
}

if (loaded !== null && Object.keys(loaded).length !== 0) {
  console.error('Unexpected export shape. Expected empty object export from current behavior.');
  process.exit(1);
}

process.exit(0);
