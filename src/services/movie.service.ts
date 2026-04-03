import Movie from "@/models/Movie";
import "@/models/Genre";
import { slugify } from "@/utils/slugify";

export const createMovieService = async (data: {
  title: string;
  description?: string;
  thumbnail: string;
  backdrop: string;
  video_url: string;
  genres: string[];
  duration: number;
  publish_date: string | Date;
  is_published?: boolean;
}) => {
  try {
    const {
      title,
      description,
      thumbnail,
      backdrop,
      video_url,
      genres,
      duration,
      publish_date,
      is_published,
    } = data;

    if (!title) {
      throw new Error("Title is required");
    }

    // Tạo slug từ title
    let slug = slugify(title);

    // Kiểm tra slug trùng
    const existingSlug = await Movie.findOne({ slug });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const movie = await Movie.create({
      title,
      description,
      thumbnail,
      backdrop,
      video_url,
      genres,
      duration,
      slug,
      publish_date,
      is_published,
    });

    return movie;
  } catch (error) {
    throw error;
  }
};

// GET ALL MOVIES
export const getAllMoviesService = async () => {
  try {
    const movies = await Movie.find()
      .populate("genres")
      .sort({ createdAt: -1 });

    return movies;
  } catch (error) {
    throw error;
  }
};

// GET MOVIE BY SLUG
export const getMovieBySlugService = async (slug: string) => {
  try {
    console.log("API slug:", slug);

    const movie = await Movie.findOne({ slug }).populate("genres");

    console.log("DB result:", movie);
    return movie;
  } catch (error) {
    throw error;
  }
};
