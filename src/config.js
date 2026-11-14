const requiredEnvVars = ['API_KEY', 'PASSWORD', 'JWT_SECRET'];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`,
  );
}

const Config = {
  API_KEY: process.env.API_KEY,
  USERNAME: 'admin',
  PASSWORD: process.env.PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  SUPPORT_EMAIL: 'support@vulnerableapp.com',
};

export default Config;
