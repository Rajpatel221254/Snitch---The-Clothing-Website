import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new error("MONGO_URI is not defined in environment variables");
}

if (!process.env.PORT) {
  throw new error("PORT is not defined in environment variables");
}
if (!process.env.JWT_SECRET) {
  throw new error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new error(
    "GOOGLE_CLIENT_SECRET is not defined in environment variables",
  );
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
