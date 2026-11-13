const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const target = path.join(__dirname, '../../../backend/server.js');
let mod;
try {
  mod = require(target);
} catch (e) {
  fail(`LOAD_FAIL: ${e && e.message ? e.message : e}`);
}

const observedType = typeof mod;
if (observedType !== 'object') {
  fail(`RESULT_CHANGED: expected typeof export to be "object", got "${observedType}"`);
}

process.exit(0);
