import mongoose, { Schema, models } from "mongoose";
import slugify from "slugify";

const genreSchema = new Schema({
  name: String,
  slug: { type: String, unique: true, required: true },
});

genreSchema.index({ slug: 1 });

// Tự động tạo slug cho Genre
genreSchema.pre("validate", function (this: any, next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

export default models.Genre || mongoose.model("Genre", genreSchema);
