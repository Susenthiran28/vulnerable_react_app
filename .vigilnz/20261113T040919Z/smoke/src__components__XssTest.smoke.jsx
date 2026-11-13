const path = require('path');

function fail(msg, err) {
  if (msg) console.error(msg);
  if (err) console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

let mod;
try {
  mod = require(path.resolve(__dirname, '../../../src/components/XssTest.jsx'));
} catch (e) {
  fail('Failed to load module at ../../../src/components/XssTest.jsx', e);
}

const XssTest = mod && (mod.default || mod);
if (typeof XssTest !== 'function') {
  fail('Expected default export to be a function component');
}

let r1, r2;
try {
  r1 = XssTest({});
  r2 = XssTest({});
} catch (e) {
  fail('Calling exported component threw unexpectedly', e);
}

if (!r1 || typeof r1 !== 'object') {
  fail('Expected component call to return a React element-like object');
}

const t1 = r1 && r1.type;
const t2 = r2 && r2.type;
if (t1 !== t2) {
  fail('Observed behavior changed: root element type is not stable across calls');
}

if (!r1.props || typeof r1.props !== 'object') {
  fail('Expected returned element to have props');
}

process.exit(0);
