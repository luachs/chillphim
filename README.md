**ChillPhim** là một web application xem phim được xây dựng bằng **Next.js 14**, **MongoDB**, và **Cloudinary**.  
Dự án hỗ trợ quản lý phim, thể loại (genres), upload hình ảnh/video và hiển thị danh sách phim.

---

# 🚀 Công nghệ sử dụng

- **Next.js 14 (App Router)**
- **MongoDB (Mongoose)**
- **TailwindCSS**
- **Cloudinary** (upload ảnh/video)
- **JWT Authentication**
- **REST API**

---

# ⚙️ Cài đặt dự án

## 1️⃣ Clone project

```bash
git clone https://github.com/luachs/chillphim.git

cd chillphim
2️⃣ Cài đặt dependencies
npm install

3️⃣ Tạo file .env.local
Sau đó thêm nội dung:
# MONGO_URI=mongodb://127.0.0.1:27017/chillphim
JWT_SECRET="1ab9013125a8da03402a39f9e55c5cc69e40c5950188d6ca48ca731292d57eab"

# cloudinary
CLOUDINARY_CLOUD_NAME = dfuvpnrrb
CLOUDINARY_API_KEY = 215814777113427
CLOUDINARY_API_SECRET = zhbMkkduVHU_In_Cbq58xmN7eDI

#mongodb
MONGO_URI=mongodb+srv://nguyenthanhphat13032005_db_user:v2zeDHWekR7ccdQO@chillphim.4uioevu.mongodb.net/chillphim?retryWrites=true&w=majority&appName=chillphim

▶️ Chạy project
Sau khi cài dependencies và cấu hình .env.local:
npm run dev
Server sẽ chạy tại:
http://localhost:3000/movies
http://localhost:3000/admin/createMovie
```
