import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
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
