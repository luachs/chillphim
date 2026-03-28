import mongoose, { Schema, models } from "mongoose";

const historySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  movie: { type: Schema.Types.ObjectId, ref: "Movie" },

  progress: Number, // số giây đã xem

  watched_at: { type: Date, default: Date.now },
});

export default models.History || mongoose.model("History", historySchema);
