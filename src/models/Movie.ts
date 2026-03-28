import slugify from "slugify";
import mongoose, { Schema, models } from "mongoose";

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    thumbnail: String,
    backdrop: String,
    video_url: String,

    genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],

    duration: Number,

    slug: { type: String, unique: true, required: true },

    publish_date: Date,

    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    is_published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// --- BONUS 1: INDEX ---
movieSchema.index({ slug: 1 });
movieSchema.index({ title: "text" }); // Hỗ trợ search bar sau này

// --- BONUS 2: TỰ ĐỘNG TẠO SLUG ---
movieSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
  next();
});

export default models.Movie || mongoose.model("Movie", movieSchema);
