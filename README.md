# 🎬 ChillPhim – Movie Streaming Management System

ChillPhim là một dự án web quản lý phim, cho phép admin tạo phim, upload video, lưu trữ hình ảnh và quản lý dữ liệu bằng MongoDB Atlas và Cloudinary.

Dự án được xây dựng nhằm mục đích học tập và thực hành các công nghệ web hiện đại như Next.js, MongoDB, Cloudinary và JWT Authentication.

---

# 🧰 Công nghệ sử dụng

- **Frontend:** Next.js + Tailwind CSS  
- **Backend:** Next.js API Routes  
- **Database:** MongoDB Atlas  
- **Storage:** Cloudinary  
- **Authentication:** JWT + Cookies  

---

# 📦 Cài đặt dự án

## 1️⃣ Clone project

```bash
git clone https://github.com/luachs/chillphim.git
cd chillphim
```

---

## 2️⃣ Cài đặt dependencies

```bash
npm install
```

---

## 3️⃣ Tạo file `.env.local`

Tại thư mục gốc của project, tạo file:

```
.env.local
```

Sau đó thêm nội dung sau:

```env
# ========================
# JWT Secret
# ========================
JWT_SECRET="1ab9013125a8da03402a39f9e55c5cc69e40c5950188d6ca48ca731292d57eab"

# ========================
# MongoDB Atlas
# ========================
MONGO_URI=mongodb+srv://nguyenthanhphat13032005_db_user:v2zeDHWekR7ccdQO@chillphim.4uioevu.mongodb.net/chillphim?retryWrites=true&w=majority&appName=chillphim

# ========================
# Cloudinary
# ========================
CLOUDINARY_CLOUD_NAME=dfuvpnrrb
CLOUDINARY_API_KEY=215814777113427
CLOUDINARY_API_SECRET=zhbMkkduVHU_In_Cbq58xmN7eDI
```

---

# ▶️ Chạy project

Sau khi hoàn tất cài đặt và cấu hình `.env.local`, chạy:

```bash
npm run dev
```

Server sẽ chạy tại:

```
http://localhost:3000
```

---

# 📂 Các Route chính

## 🎞️ Danh sách phim

```
http://localhost:3000/movies
```

Hiển thị danh sách tất cả phim trong hệ thống.

---

## 🛠️ Tạo phim mới (Admin)

```
http://localhost:3000/admin/createMovie
```

Chức năng:

- Tạo phim mới  
- Upload thumbnail  
- Upload backdrop  
- Upload video  
- Lưu dữ liệu vào MongoDB  

---


# 🔐 Authentication

Dự án sử dụng:

- JWT Token
- HTTP Cookies
- Bcrypt Password Hashing

Bao gồm:

- Register API
- Login API
- Protected Routes

---

# ☁️ Storage & Database

## MongoDB Atlas

Lưu trữ:

- Users
- Movies
- Genres

## Cloudinary

Lưu trữ:

- Thumbnail
- Backdrop
- Video

---
# 👨‍💻 Author

**Nguyễn Thành Phát**

Project phục vụ mục đích học tập về:

- Web Development
- Cloud Computing
- Fullstack Development

---

# ⭐ Future Improvements

- 🎥 Movie Streaming Player
- 🔍 Search Movies
- 🎭 Genre Filtering
- ❤️ Favorite Movies
- 👤 User Roles (Admin / User)
- 📱 Responsive UI
- 🚀 Deploy lên Cloud (AWS / Vercel)

---

# 📜 License

This project is created for educational purposes.
