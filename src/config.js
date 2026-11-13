const Config = {
    API_KEY: process.env.API_KEY || 'SUPER_SECRET_API_KEY_12345',
    USERNAME: 'admin',
    PASSWORD: process.env.PASSWORD || 'SuperSecretDBPassword!',
    JWT_SECRET: process.env.JWT_SECRET || 'VERY_INSECURE_JWT_SECRET',
    SUPPORT_EMAIL: 'support@vulnerableapp.com',
  };
  
  export default Config;
