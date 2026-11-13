const path = require('path');

function fail(msg, err) {
  if (msg) console.error(msg);
  if (err) console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}

let mod;
try {
  mod = require('../../../src/config.js');
} catch (e) {
  fail('Failed to load ../../../src/config.js', e);
}

try {
  const Config = (mod && mod.default) ? mod.default : mod;

  const observed = {
    API_KEY: Config.API_KEY,
    USERNAME: Config.USERNAME,
    PASSWORD: Config.PASSWORD,
    JWT_SECRET: Config.JWT_SECRET,
    SUPPORT_EMAIL: Config.SUPPORT_EMAIL,
  };

  const expected = {
    API_KEY: 'SUPER_SECRET_API_KEY_12345',
    USERNAME: 'admin',
    PASSWORD: 'SuperSecretDBPassword!',
    JWT_SECRET: 'VERY_INSECURE_JWT_SECRET',
    SUPPORT_EMAIL: 'support@vulnerableapp.com',
  };

  const same = JSON.stringify(observed) === JSON.stringify(expected);
  if (!same) {
    fail(`Observed config changed. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(observed)}`);
  }
} catch (e) {
  fail('Failed while reading exported config values', e);
}
