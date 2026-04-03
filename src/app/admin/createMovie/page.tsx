"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";

// 1. Định nghĩa cấu trúc cho Movie Form
interface MovieForm {
  title: string;
  description: string;
  thumbnail: string;
  backdrop: string;
  video_url: string;
  genres: string[]; // Mảng chứa các ID của thể loại
  duration: string | number;
  publish_date: string;
  is_published: boolean;
}

// 2. Định nghĩa cấu trúc cho Genre từ API trả về
interface Genre {
  _id: string;
  name: string;
}

export default function CreateMovie() {
  const [form, setForm] = useState<MovieForm>({
    title: "",
    description: "",
    thumbnail: "",
    backdrop: "",
    video_url: "",
    genres: [],
    duration: "",
    publish_date: "",
    is_published: true,
  });

  const [genreList, setGenreList] = useState<Genre[]>([]);

  // upload states
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((json) => {
        // Log để kiểm tra (như trong ảnh bạn chụp)
        console.log("Dữ liệu Genres từ API:", json);

        // Vì ảnh cho thấy mảng nằm trong trường 'data'
        if (json && Array.isArray(json.data)) {
          setGenreList(json.data); // Trỏ vào json.data để lấy mảng Array(4)
        } else {
          console.error("Cấu trúc API không đúng mong đợi:", json);
          setGenreList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching genres:", err);
        setGenreList([]);
      });
  }, []);

  // input text/textarea
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // upload image
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url as string;
  };

  const handleUploadImages = async () => {
    if (!thumbnailFile || !backdropFile) {
      alert("Vui lòng chọn đủ ảnh");
      return;
    }

    try {
      setLoadingUpload(true);

      const [thumbUrl, backUrl] = await Promise.all([
        uploadImage(thumbnailFile),
        uploadImage(backdropFile),
      ]);

      setForm((prev) => ({
        ...prev,
        thumbnail: thumbUrl,
        backdrop: backUrl,
      }));

      alert("Upload thành công!");
    } catch (err) {
      console.log(err);
      alert("Upload lỗi");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleGenreSelect = (id: string) => {
    setForm((prev) => {
      const exists = prev.genres.includes(id);
      return {
        ...prev,
        genres: exists
          ? prev.genres.filter((gid) => gid !== id)
          : [...prev.genres, id],
      };
    });
  };

  // submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.thumbnail || !form.backdrop) {
      alert("Bạn cần upload ảnh trước khi tạo phim");
      return;
    }

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          duration: Number(form.duration),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        alert("Movie created!");
      } else {
        alert("Failed to create movie");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
        Admin - Create Movie
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          placeholder="Title"
          onChange={handleChange}
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        {/* Upload Thumbnail */}
        <div>
          <p className="font-semibold">Thumbnail</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setThumbnailFile(e.target.files ? e.target.files[0] : null)
            }
          />
          {form.thumbnail && (
            <img
              src={form.thumbnail}
              className="w-40 mt-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60"
            />
          )}
        </div>

        {/* Upload Backdrop */}
        <div>
          <p className="font-semibold">Backdrop</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setBackdropFile(e.target.files ? e.target.files[0] : null)
            }
          />
          {form.backdrop && (
            <img
              src={form.backdrop}
              className="w-full mt-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60"
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleUploadImages}
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded">
          {loadingUpload ? "Uploading..." : "Upload Images"}
        </button>

        <input
          name="video_url"
          value={form.video_url}
          placeholder="Video URL"
          onChange={handleChange}
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        {/* Genres checkbox */}
        <div>
          <p className="text-sm font-semibold mb-2">
            Thể loại (Chọn nhiều)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {genreList.map((g) => (
              <label
                key={g._id}
                className={`flex items-center gap-2 rounded cursor-pointer border p-2 transition ${
                  form.genres.includes(g._id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}>
                <input
                  type="checkbox"
                  checked={form.genres.includes(g._id)}
                  onChange={() => handleGenreSelect(g._id)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm text-zinc-900 dark:text-zinc-50">
                  {g.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <input
          name="duration"
          type="number"
          value={form.duration}
          placeholder="Duration (minutes)"
          onChange={handleChange}
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        <input
          name="publish_date"
          type="date"
          value={form.publish_date}
          onChange={handleChange}
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded transition">
          Create Movie
        </button>
      </form>
    </div>
  );
}
