import mongoose, { Schema, models } from "mongoose";

const favoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    movie: { type: Schema.Types.ObjectId, ref: "Movie" },
  },
  { timestamps: true },
);

// --- BONUS: COMPOUND INDEX ---
// Đảm bảo cặp (user + movie) là duy nhất.
// Nếu user đã thích phim A rồi, hệ thống sẽ chặn không cho lưu thêm dòng nữa.
favoriteSchema.index({ user: 1, movie: 1 }, { unique: true });

export default models.Favorite || mongoose.model("Favorite", favoriteSchema);
