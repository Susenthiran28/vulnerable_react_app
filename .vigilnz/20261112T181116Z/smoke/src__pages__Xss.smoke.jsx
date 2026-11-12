const path = require('path');

function fail(msg, err) {
  if (msg) console.error(msg);
  if (err) console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

let mod;
try {
  const target = path.resolve(__dirname, '../../../src/pages/Xss.jsx');
  mod = require(target);
} catch (e) {
  fail('Failed to load module ../../../src/pages/Xss.jsx', e);
}

try {
  const candidate = mod && (mod.default || mod.XssComplex || mod);
  if (typeof candidate !== 'function') {
    fail('Expected exported React component function from ../../../src/pages/Xss.jsx');
  }

  // Characterize current behavior: component can be invoked with simple props
  // and returns a non-null render value without throwing.
  const result = candidate({});

  if (result == null) {
    fail('Observed behavior changed: component returned null/undefined');
  }

  const t = typeof result;
  if (t !== 'object' && t !== 'string' && t !== 'number' && t !== 'boolean') {
    fail('Observed behavior changed: unexpected return type ' + t);
  }

  process.exit(0);
} catch (e) {
  fail('Failed while invoking exported component from ../../../src/pages/Xss.jsx', e);
}
