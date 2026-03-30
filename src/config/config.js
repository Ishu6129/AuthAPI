import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "PORT",
  "MONGO_URL",
  "JWT_SECRET",
  "EMAIL_USER",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REFRESH_TOKEN",
  "REDIS_URL",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const config = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
};

export default config;