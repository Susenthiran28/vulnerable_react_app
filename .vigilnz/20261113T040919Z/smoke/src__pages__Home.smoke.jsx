const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const target = path.join(__dirname, '../../../src/pages/Home.jsx');
let mod;
try {
  mod = require(target);
} catch (e) {
  fail('Failed to load module: ' + e.message);
}

const Home = mod && (mod.default || mod.Home || mod);
if (typeof Home !== 'function') {
  fail('Expected Home export to be a function');
}

let result;
try {
  result = Home();
} catch (e) {
  fail('Calling Home threw: ' + e.message);
}

const isObjectLike = result !== null && (typeof result === 'object' || typeof result === 'function');
if (!isObjectLike) {
  fail('Home() return shape changed: expected object-like React element');
}

process.exit(0);
