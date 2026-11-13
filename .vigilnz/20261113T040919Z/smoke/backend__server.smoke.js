const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let loaded;
try {
  loaded = require(path.join(__dirname, '../../../backend/server.js'));
} catch (e) {
  fail('Failed to load backend/server.js: ' + (e && e.message ? e.message : e));
}

let baseline;
try {
  baseline = loaded;
} catch (e) {
  fail('Calling loaded export from backend/server.js threw: ' + (e && e.message ? e.message : e));
}

let current;
try {
  current = loaded;
} catch (e) {
  fail('Re-checking loaded export from backend/server.js threw: ' + (e && e.message ? e.message : e));
}

if (current !== baseline) {
  fail('Observed result changed for backend/server.js');
}

process.exit(0);
