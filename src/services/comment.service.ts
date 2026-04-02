import Comment from "@/models/Comment";
import mongoose from "mongoose";

// ✅ Tạo comment
export const createComment = async (
  userId: string,
  movieId: string,
  content: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    throw new Error("Invalid movieId");
  }

  if (!content) {
    throw new Error("Content is required");
  }

  const comment = await Comment.create({
    user: userId,
    movie: movieId,
    content,
  });

  return comment;
};

// ✅ Lấy comment theo movie
export const getCommentsByMovie = async (movieId: string) => {
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    throw new Error("Invalid movieId");
  }

  return await Comment.find({ movie: movieId })
    .populate("user", "username avatar") // lấy info user
    .sort({ createdAt: -1 }); // mới nhất lên đầu
};
