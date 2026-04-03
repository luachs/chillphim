import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in .env.local");
}

// Tránh connect lại nhiều lần (Next.js dev reload)
type MongooseCache = {
  conn: unknown;
  promise: Promise<unknown> | null;
};

const globalWithMongoose = globalThis as unknown as {
  mongoose?: MongooseCache;
};

const cached: MongooseCache =
  globalWithMongoose.mongoose ?? { conn: null, promise: null };

// Hàm phụ để tạo Admin
async function seedAdmin() {
  try {
    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin", // Đảm bảo model User có field role
      });
      console.log(
        "🚀 [Seed]: Admin account created (admin@gmail.com / admin123)",
      );
    } else {
      console.log("ℹ️ [Seed]: Admin already exists");
    }
  } catch (error) {
    console.error("❌ [Seed Error]:", error);
  }
}

export async function connectDB(): Promise<unknown> {
  if (cached.conn) {
    console.log("✅ [MongoDB]: Already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⌛ [MongoDB]: Connecting...");
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "chillphim",
    }) as unknown as Promise<unknown>;
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ [MongoDB]: Connected successfully!");

    globalWithMongoose.mongoose = cached;

    // Gọi hàm seedAdmin sau khi kết nối thành công
    await seedAdmin();

    return cached.conn;
  } catch (error) {
    console.error("❌ [MongoDB]: Connection failed", error);
    throw error;
  }
}
