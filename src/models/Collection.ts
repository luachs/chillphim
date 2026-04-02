import mongoose, { Schema, models, model } from "mongoose";

const collectionSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

collectionSchema.index({ slug: 1 });

const Collection = models.Collection || model("Collection", collectionSchema);
export default Collection;
