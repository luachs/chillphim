import Movie from "@/models/Movie";

export const MovieService = {
  // GET ALL: Hỗ trợ tìm kiếm theo text index (title)
  getAll: async (search: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    // Nếu có search, dùng regex để tìm kiếm linh hoạt trong title
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const [movies, total] = await Promise.all([
      Movie.find(query)
        .populate("genres") // Khớp với ref: "Genre" trong model
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Movie.countDocuments(query),
    ]);

    return { movies, total };
  },

  // GET DETAIL: Tìm theo ID hoặc có thể mở rộng tìm theo Slug
  getById: async (id: string) => {
    const movie = await Movie.findById(id).populate("genres");
    if (!movie) throw new Error("Movie not found");
    return movie;
  },

  // CREATE: Không cần truyền slug, model sẽ tự tạo từ title
  create: async (data: any) => {
    // data nên chứa: title, description, thumbnail, backdrop, video_url, genres (array ID), duration...
    return await Movie.create(data);
  },

  // UPDATE: Cập nhật thông tin và tự động update slug nếu title thay đổi
  update: async (id: string, data: any) => {
    const movie = await Movie.findById(id);
    if (!movie) throw new Error("Movie not found");

    // Gán dữ liệu mới
    Object.assign(movie, data);

    // Lưu bằng .save() để kích hoạt middleware pre("validate") tạo lại slug
    return await movie.save();
  },

  // DELETE
  delete: async (id: string) => {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) throw new Error("Movie not found");
    return true;
  },
};
