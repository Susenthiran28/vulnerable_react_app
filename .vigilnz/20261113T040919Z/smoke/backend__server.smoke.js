const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let loaded;
try {
  loaded = require(path.join(__dirname, '../../../backend/server.js'));
} catch (e) {
  fail('LOAD_FAIL backend/server.js: ' + (e && e.message ? e.message : e));
}

if (typeof loaded !== 'object' && typeof loaded !== 'function') {
  fail('UNEXPECTED_EXPORT backend/server.js');
}

process.exit(0);
