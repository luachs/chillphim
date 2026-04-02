"use client";

import { useState } from "react";

export default function UploadPage() {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [backdropFile, setBackdropFile] = useState(null);

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");

  const [loading, setLoading] = useState(false);

  // Upload function
  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    return data.url;
  };

  const handleUpload = async () => {
    if (!thumbnailFile || !backdropFile) {
      alert("Vui lòng chọn đủ thumbnail và backdrop");
      return;
    }

    try {
      setLoading(true);

      const thumbUrl = await uploadImage(thumbnailFile);
      const backUrl = await uploadImage(backdropFile);

      setThumbnailUrl(thumbUrl);
      setBackdropUrl(backUrl);

      alert("Upload thành công!");
    } catch (error) {
      console.log(error);
      alert("Upload lỗi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Upload Movie Images</h1>

      <br />

      {/* Thumbnail */}
      <div>
        <h3>Thumbnail</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files[0])}
        />

        {thumbnailUrl && (
          <div>
            <p>Preview:</p>

            <img src={thumbnailUrl} alt="thumbnail" width={200} />
          </div>
        )}
      </div>

      <br />

      {/* Backdrop */}
      <div>
        <h3>Backdrop</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBackdropFile(e.target.files[0])}
        />

        {backdropUrl && (
          <div>
            <p>Preview:</p>

            <img src={backdropUrl} alt="backdrop" width={300} />
          </div>
        )}
      </div>

      <br />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}>
        {loading ? "Uploading..." : "Upload Images"}
      </button>

      <br />
      <br />

      {/* Show URLs */}
      {thumbnailUrl && (
        <div>
          <p>
            <strong>Thumbnail URL:</strong>
          </p>
          <p>{thumbnailUrl}</p>
        </div>
      )}

      {backdropUrl && (
        <div>
          <p>
            <strong>Backdrop URL:</strong>
          </p>
          <p>{backdropUrl}</p>
        </div>
      )}
    </div>
  );
}
