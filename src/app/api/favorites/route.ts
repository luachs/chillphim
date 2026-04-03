import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { toggleFavorite, getFavorites } from "@/services/favorite.service";

// ✅ POST /favorites/toggle
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, movieId } = body;

    if (!userId || !movieId) {
      return NextResponse.json(
        { success: false, message: "Missing userId or movieId" },
        { status: 400 },
      );
    }

    const result = await toggleFavorite(userId, movieId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle favorite";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}

// ✅ GET /favorites?userId=xxx
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 },
      );
    }

    const favorites = await getFavorites(userId);

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
