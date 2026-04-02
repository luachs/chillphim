import mongoose, { Schema, models } from "mongoose";

const genreSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
  },
  { timestamps: true }, // 👍 nên có
);

export default models.Genre || mongoose.model("Genre", genreSchema);
