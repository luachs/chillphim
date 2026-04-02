import mongoose, { Schema, models } from "mongoose";
import Genre from "./Genre";
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

export default models.Movie || mongoose.model("Movie", movieSchema);
