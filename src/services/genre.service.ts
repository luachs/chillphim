import Genre from "@/models/Genre";
import { slugify } from "@/utils/slugify";

export const getAllGenres = async () => {
  return await Genre.find().sort({ name: 1 });
};

export const createGenre = async (data: { name: string }) => {
  const slug = slugify(data.name);

  // check trùng slug (rất quan trọng)
  const existing = await Genre.findOne({ slug });
  if (existing) {
    throw new Error("Genre already exists");
  }

  const genre = new Genre({
    name: data.name,
    slug,
  });

  return await genre.save();
};
