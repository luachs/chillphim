import Favorite from "@/models/Favorite";
import mongoose from "mongoose";

export const toggleFavorite = async (userId: string, movieId: string) => {
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    throw new Error("Invalid movieId");
  }

  const existed = await Favorite.findOne({
    user: userId,
    movie: movieId,
  });

  // ❌ nếu đã tồn tại → xóa
  if (existed) {
    await Favorite.deleteOne({ _id: existed._id });

    return {
      action: "removed",
    };
  }

  // ✅ nếu chưa → tạo mới
  const newFavorite = await Favorite.create({
    user: userId,
    movie: movieId,
  });

  return {
    action: "added",
    data: newFavorite,
  };
};

// ✅ Get favorites
export const getFavorites = async (userId: string) => {
  return await Favorite.find({ user: userId })
    .populate("movie", "title thumbnail slug") // tối ưu
    .sort({ createdAt: -1 });
};
