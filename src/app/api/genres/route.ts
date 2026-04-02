import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { getAllGenres, createGenre } from "@/services/genre.service";

// GET /api/genres
export async function GET() {
  try {
    await connectDB();
    const genres = await getAllGenres();

    return NextResponse.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching genres" },
      { status: 500 },
    );
  }
}

// POST /api/genres
export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔐 Kiểm tra login
    const user = authMiddleware(req);

    // 🔐 Chỉ admin mới được tạo genre
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin only" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const genre = await createGenre({
      name: body.name,
    });

    return NextResponse.json({
      success: true,
      data: genre,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
