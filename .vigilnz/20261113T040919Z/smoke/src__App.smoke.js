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
  mod = require(path.join(__dirname, '../../../src/App.js'));
} catch (e) {
  fail('LOAD_FAIL src/App.js: ' + (e && e.message ? e.message : e));
}

const App = mod && (mod.default || mod);
if (typeof App !== 'function') {
  fail('CALLABLE_EXPORT_MISSING src/App.js');
}

let result;
try {
  result = App();
} catch (e) {
  fail('CALL_FAIL src/App.js default export: ' + (e && e.message ? e.message : e));
}

if (!result || typeof result !== 'object' || !('type' in result)) {
  fail('UNEXPECTED_RESULT src/App.js default export');
}

process.exit(0);
