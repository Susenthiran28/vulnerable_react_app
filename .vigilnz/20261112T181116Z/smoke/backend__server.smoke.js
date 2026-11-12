const path = require('path');

const targetPath = path.resolve(__dirname, '../../../backend/server.js');

let loaded;
try {
  loaded = require(targetPath);
} catch (e) {
  console.error('Failed to load module:', e && e.message ? e.message : e);
  process.exit(1);
}

if (typeof loaded === 'undefined') {
  console.error('Unexpected: require returned undefined');
  process.exit(1);
}

if (loaded !== loaded) {
  console.error('Result changed unexpectedly');
  process.exit(1);
}

process.exit(0);
