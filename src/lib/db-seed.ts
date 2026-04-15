// lib/db-seed.ts
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function seedAdmin() {
  try {
    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
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
