import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createComment } from "@/services/comment.service";

// ✅ POST /comments
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, movieId, content } = body;

    if (!userId || !movieId || !content) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 },
      );
    }

    const comment = await createComment(userId, movieId, content);

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 },
    );
  }
}
