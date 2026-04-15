/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Bỏ qua lỗi linting khi build
  },
  typescript: {
    ignoreBuildErrors: true, // Bỏ qua lỗi type nếu bạn chưa fix hết
  },
  images: {
    domains: ["res.cloudinary.com"], // Cho phép hiển thị ảnh từ Cloudinary
  },
};

export default nextConfig;
