const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let loaded;
try {
  loaded = require(path.join(__dirname, '../../../backend/server.js'));
} catch (e) {
  fail('Failed to load ../../../backend/server.js: ' + (e && e.stack ? e.stack : e));
}

let observed;
try {
  observed = typeof loaded;
} catch (e) {
  fail('Loaded module access threw: ' + (e && e.stack ? e.stack : e));
}

if (observed !== 'object') {
  fail('Behavior changed: expected typeof export to be "object", got ' + observed);
}

process.exit(0);
