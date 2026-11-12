const path = require('path');

let mod;
try {
  mod = require('../../../src/config.js');
} catch (e) {
  console.error('Failed to load module:', e && e.message ? e.message : e);
  process.exit(1);
}

const cfg = mod && (mod.default || mod);
if (!cfg || typeof cfg !== 'object') {
  console.error('Loaded value is not an object');
  process.exit(1);
}

const expected = {
  API_KEY: 'SUPER_SECRET_API_KEY_12345',
  USERNAME: 'admin',
  PASSWORD: 'SuperSecretDBPassword!',
  JWT_SECRET: 'VERY_INSECURE_JWT_SECRET',
  SUPPORT_EMAIL: 'support@vulnerableapp.com',
};

try {
  for (const [k, v] of Object.entries(expected)) {
    if (cfg[k] !== v) {
      console.error(`Value changed for ${k}: expected ${JSON.stringify(v)}, got ${JSON.stringify(cfg[k])}`);
      process.exit(1);
    }
  }
} catch (e) {
  console.error('Failed while validating config:', e && e.message ? e.message : e);
  process.exit(1);
}

process.exit(0);
