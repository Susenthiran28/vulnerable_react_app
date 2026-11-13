const path = require('path');

(async () => {
  let mod;
  try {
    mod = await import(path.resolve(__dirname, '../../../src/pages/Xss.jsx'));
  } catch (e) {
    console.error('Failed to load module:', e && e.stack ? e.stack : e);
    process.exit(1);
  }

  try {
    const exp = mod && (mod.default || mod.XssComplex || mod);
    if (typeof exp !== 'function') {
      throw new Error('Expected component export to be a function');
    }

    const result1 = exp();
    const result2 = exp();

    const isObjectLike = (v) => v !== null && (typeof v === 'object' || typeof v === 'function');
    if (!isObjectLike(result1) || !isObjectLike(result2)) {
      throw new Error('Expected component invocation to return an object-like React element');
    }

    const shape1 = `${result1.$$typeof ? 'react' : 'nonreact'}:${result1.type ? 'hasType' : 'noType'}`;
    const shape2 = `${result2.$$typeof ? 'react' : 'nonreact'}:${result2.type ? 'hasType' : 'noType'}`;

    const baselineShape = 'react:hasType';
    if (shape1 !== baselineShape || shape2 !== baselineShape) {
      throw new Error(`Observed result shape changed. Got ${shape1} and ${shape2}, expected ${baselineShape}`);
    }
  } catch (e) {
    console.error('Smoke test failed:', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();
