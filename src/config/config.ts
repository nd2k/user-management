import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  PORT: number | undefined;
  BASE_URL: string | undefined;
  SALT_WORK_FACTOR: number | undefined;
  MONGO_URI: string | undefined;
  PUBLIC_KEY: string | undefined;
  PRIVATE_KEY: string | undefined;
  ACCESS_TOKEN_DURATION: string | undefined;
  REFRESH_TOKEN_DURATION: string | undefined;
}

interface Config {
  PORT: number;
  BASE_URL: string;
  SALT_WORK_FACTOR: number;
  MONGO_URI: string;
  PUBLIC_KEY: string;
  PRIVATE_KEY: string;
  ACCESS_TOKEN_DURATION: string;
  REFRESH_TOKEN_DURATION: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    BASE_URL: process.env.BASE_URL ? String(process.env.BASE_URL) : undefined,
    SALT_WORK_FACTOR: process.env.SALT_WORK_FACTOR
      ? Number(process.env.SALT_WORK_FACTOR)
      : undefined,
    MONGO_URI: process.env.MONGO_URI
      ? String(process.env.MONGO_URI)
      : undefined,
    PUBLIC_KEY: process.env.PUBLIC_KEY
      ? String(process.env.PUBLIC_KEY)
      : undefined,
    PRIVATE_KEY: process.env.PRIVATE_KEY
      ? String(process.env.PRIVATE_KEY)
      : undefined,
    ACCESS_TOKEN_DURATION: process.env.ACCESS_TOKEN_DURATION
      ? String(process.env.ACCESS_TOKEN_DURATION)
      : undefined,
    REFRESH_TOKEN_DURATION: process.env.REFRESH_TOKEN_DURATION
      ? String(process.env.REFRESH_TOKEN_DURATION)
      : undefined,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const configuration = getConfig();

const sanitizedConfig = getSanitzedConfig(configuration);

export default sanitizedConfig;
