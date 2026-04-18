import mongoose from "mongoose";
import { config } from "./config.js";

export const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);

    console.log("Database is connected");
  } catch (err) {
    throw new error(err.message);
  }
};
