import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) throw new Error("Please define MONGO_URI in .env.local");

// Định nghĩa interface để TypeScript không than phiền
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Khai báo global variable
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("⌛ [MongoDB]: Connecting...");
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: "chillphim",
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ [MongoDB]: Connected successfully!");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ [MongoDB]: Connection failed", error);
    throw error;
  }
}
