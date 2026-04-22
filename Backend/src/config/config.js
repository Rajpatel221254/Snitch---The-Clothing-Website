import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// Allow a default PORT for local development if not provided
if (!process.env.PORT) {
  process.env.PORT = "3000";
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_SECRET is not defined in environment variables",
  );
}

if (!process.env.MULTER_PRIVATE_KEY) {
  throw new Error("MULTER_PRIVATE_KEY is not defined in environment variables");
}

if (!process.env.MULTER_PUBLIC_KEY) {
  throw new Error("MULTER_PUBLIC_KEY is not defined in environment variables");
}

if (!process.env.MULTER_URL_ENDPOINT) {
  throw new Error(
    "MULTER_URL_ENDPOINT is not defined in environment variables",
  );
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  MULTER_PRIVATE_KEY: process.env.MULTER_PRIVATE_KEY,
  MULTER_PUBLIC_KEY: process.env.MULTER_PUBLIC_KEY,
  MULTER_URL_ENDPOINT: process.env.MULTER_URL_ENDPOINT,
};
