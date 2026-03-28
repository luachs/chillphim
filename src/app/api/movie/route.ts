import { connectDB } from "@/lib/db";
import { MovieService } from "@/services/movie.service";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const { movies, total } = await MovieService.getAll(search, page, limit);

  return NextResponse.json({
    data: movies,
    pagination: { total, page, limit },
  });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user: any = authMiddleware(req);

    if (user.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const movie = await MovieService.create(body);

    return NextResponse.json({ message: "Create movie success", data: movie });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: error.message === "Unauthorized" ? 401 : 400 },
    );
  }
}
