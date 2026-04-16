import Collection from "@/models/Collection";
import { slugify } from "@/utils/slugify";
import "@/models/Movie";

// helper tạo slug unique
const generateUniqueSlug = async (name: string) => {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let count = 1;

  while (await Collection.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

export const createCollection = async (data: {
  name: string;
  movies?: string[];
}) => {
  const { name, movies } = data;

  // validate
  if (!name) {
    throw new Error("Name is required");
  }

  // tạo slug unique
  const slug = await generateUniqueSlug(name);

  const newCollection = await Collection.create({
    name,
    slug,
    movies: movies || [],
  });

  return newCollection;
};
export const getAllCollections = async () => {
  try {
    const collections = await Collection.find({ is_active: true })
      .populate({
        path: "movies",
        select: "title thumbnail slug duration genres backdrop description",
        options: { lean: true },
      })
      .sort({ createdAt: -1 })
      .lean();

    return collections;
  } catch (error) {
    console.error("❌ getAllCollections error:", error);
    return []; // ⚠️ KHÔNG throw nữa
  }
};

export const getCollectionBySlug = async (slug: string) => {
  return await Collection.findOne({ slug, is_active: true }).populate("movies");
};
