import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectToMongo() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoDbUri);
  return mongoose.connection;
}

