import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config({ path: '.env' });
const deployment = process.env.NODE || 'development';
const CONFIG = {
  env: deployment,

  // Server
  PORT: process.env.PORT || 3000,
  API_VERSION: process.env.API_VERSION || 'v1',

  // Database
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'backend-secret',
  JWT_PASSWORD: process.env.JWT_PASSWORD,
  JWT_ACCESS_EXPIRATION_MINUTES: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30),
  JWT_REFRESH_EXPIRATION_DAYS: Number(process.env.JWT_REFRESH_EXPIRATION_DAYS || 30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || 10),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || 10),

  // URIs
  ATLAS_URI: process.env.ATLAS_URI || 'mongodb://root:password@localhost:27017/testdb?authSource=admin',
  CLIENT_URI: process.env.CLIENT_URI,
  SERVER_URI: process.env.SERVER_URI,

  // Socket
  SOCKET: {
    SOCKET_TOKEN: process.env.SOCKET_TOKEN,
  },

  // Firebase Config
  FIREBASE: {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  },
};
console.log(chalk.yellowBright(`You are running in ${deployment} Mode`));

export default CONFIG;