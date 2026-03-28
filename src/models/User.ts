import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    avatar: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export default models.User || mongoose.model("User", userSchema);
