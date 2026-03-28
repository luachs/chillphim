import mongoose, { Schema, models } from "mongoose";

const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    movie: { type: Schema.Types.ObjectId, ref: "Movie" },
    content: String,
  },
  { timestamps: true },
);

export default models.Comment || mongoose.model("Comment", commentSchema);
