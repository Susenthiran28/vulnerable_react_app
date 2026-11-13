const path = require('path');

function fail(msg, err) {
  if (msg) console.error(msg);
  if (err) console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

const target = path.join(__dirname, '../../../backend/server.js');

let loaded;
try {
  loaded = require(target);
} catch (e) {
  fail('Failed to load backend/server.js', e);
}

try {
  if (typeof loaded === 'undefined') {
    fail('Loaded module is undefined');
  }
} catch (e) {
  fail('Post-load validation failed', e);
}

process.exit(0);
