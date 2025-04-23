import mongoose from "mongoose";
import { MONGO_URL } from "../utils/constants";
export const connect_db = async () => {
  try {
    if (!MONGO_URL) {
      throw new Error("MONGO_URL must be a defined string");
    }
    await mongoose.connect(MONGO_URL);
    console.log("connected to database");
  } catch (error) {
    console.error("Error connecting to database", error);
  }
};
