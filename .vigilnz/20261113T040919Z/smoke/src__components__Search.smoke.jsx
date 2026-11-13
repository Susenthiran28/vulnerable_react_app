require('@babel/register')({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  extensions: ['.js', '.jsx'],
  ignore: [/node_modules/]
});

const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let mod;
try {
  mod = require(path.join(__dirname, '../../../src/components/Search.jsx'));
} catch (e) {
  fail('LOAD_FAIL src/components/Search.jsx: ' + (e && e.message ? e.message : e));
}

const Search = mod && (mod.default || mod);
if (typeof Search !== 'function') {
  fail('CALLABLE_EXPORT_MISSING src/components/Search.jsx');
}

process.exit(0);
