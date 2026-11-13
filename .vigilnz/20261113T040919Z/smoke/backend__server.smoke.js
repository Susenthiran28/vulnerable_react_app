const path = require('path');

function fail(msg, err) {
  if (err) {
    console.error(msg, err && err.stack ? err.stack : err);
  } else {
    console.error(msg);
  }
  process.exit(1);
}

let loaded;
try {
  loaded = require(path.join(__dirname, '../../../backend/server.js'));
} catch (e) {
  fail('Failed to load backend/server.js', e);
}

const observedType = typeof loaded;
if (observedType !== 'object') {
  fail(`Behavior changed: expected module export type "object", got "${observedType}"`);
}

process.exit(0);
