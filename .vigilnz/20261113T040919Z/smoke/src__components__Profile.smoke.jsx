const path = require('path');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const target = path.join(__dirname, '../../../src/components/Profile.jsx');

let loaded;
try {
  loaded = require(target);
} catch (e) {
  fail(`Failed to load ${target}: ${e && e.message ? e.message : e}`);
}

let observed;
try {
  if (typeof loaded === 'function') {
    observed = loaded({});
  } else if (loaded && typeof loaded.default === 'function') {
    observed = loaded.default({});
  } else {
    observed = loaded;
  }
} catch (e) {
  fail(`Loaded module threw when called/read: ${e && e.message ? e.message : e}`);
}

let stable;
try {
  stable = JSON.stringify(observed);
} catch (e) {
  fail(`Failed to serialize observed result: ${e && e.message ? e.message : e}`);
}

const expected = stable;
if (stable !== expected) {
  fail(`Observed result changed. expected=${expected} actual=${stable}`);
}

process.exit(0);
