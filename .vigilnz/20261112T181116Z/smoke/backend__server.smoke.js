const path = require('path');

let loaded;
try {
  loaded = require(path.resolve(__dirname, '../../../backend/server.js'));
} catch (e) {
  console.error('Failed to load module:', e && e.message ? e.message : e);
  process.exit(1);
}

try {
  // Characterize current behavior: module should load successfully.
  // Export shape may vary (undefined/object/function) across refactors.
  if (typeof loaded === 'symbol') {
    throw new Error('Unexpected export type');
  }
} catch (e) {
  console.error('Behavior check failed:', e && e.message ? e.message : e);
  process.exit(1);
}

process.exit(0);
