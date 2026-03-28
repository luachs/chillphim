import { connectDB } from "@/lib/db"; // đường dẫn tới file connect của bạn
import Collection from "@/models/Collection";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  // Ghi thử một dữ liệu để ép MongoDB tạo Database
  await Collection.create({ name: "Phim Hành Động", slug: "phim-hanh-dong" });
  return NextResponse.json({ message: "Đã tạo dữ liệu mẫu!" });
}
