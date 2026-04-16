# ---------- Stage 1: Dependencies ----------
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# ---------- Stage 2: Build ----------
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js cần ENV trong lúc build nếu bạn có dùng biến môi trường trong code client-side

ENV JWT_SECRET="1ab9013125a8da03402a39f9e55c5cc69e40c5950188d6ca48ca731292d57eab"

ENV MONGO_URI=mongodb+srv://nguyenthanhphat13032005_db_user:v2zeDHWekR7ccdQO@chillphim.4uioevu.mongodb.net/chillphim?retryWrites=true&w=majority&appName=chillphim

ENV CLOUDINARY_CLOUD_NAME=dfuvpnrrb
ENV CLOUDINARY_API_KEY=215814777113427
ENV CLOUDINARY_API_SECRET=zhbMkkduVHU_In_Cbq58xmN7eDI

RUN npm run build

# ---------- Stage 3: Production ----------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy các file cần thiết (Lưu ý đường dẫn public)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# Sửa lỗi thư mục public nằm trong src
COPY --from=builder /app/src/public ./public 

EXPOSE 3000

CMD ["npm", "start"]