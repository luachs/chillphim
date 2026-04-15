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
# COPY .env.local .env.local 
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