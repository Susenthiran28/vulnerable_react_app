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
  mod = require(path.join(__dirname, '../../../src/components/Profile.jsx'));
} catch (e) {
  fail('LOAD_FAIL src/components/Profile.jsx: ' + (e && e.message ? e.message : e));
}

const Profile = mod && (mod.default || mod);
if (typeof Profile !== 'function') {
  fail('CALLABLE_EXPORT_MISSING src/components/Profile.jsx');
}

process.exit(0);
