import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const data = await req.formData();

    const file = data.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "movies",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return Response.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
