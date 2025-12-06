import { config } from "dotenv";

//LOAD MULTIPLE ENV FILE
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local`});

// TYPE-SAFE ENVIRONMENT VARIABLES with validation
function getRequiredEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value || value.trim() === '') {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

//TYPE-SAFE ENVIRONMENT VARIABLES
export const PORT = process.env.PORT || 5500;
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = getRequiredEnv('JWT_SECRET', 'aca2beadc13cfe0cd61dca0875b8552d');
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'

//TYPE FOR CONFIG OBJECT
export interface Config {
    PORT: string | number
    NODE_ENV: string
    DATABASE_URL: string
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
}

export const configuration: Config = {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN
}
