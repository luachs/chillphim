import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCommentsByMovie } from "@/services/comment.service";

export async function GET(
  req: Request,
  { params }: { params: { movieId: string } },
) {
  try {
    await connectDB();

    const comments = await getCommentsByMovie(params.movieId);

    return NextResponse.json({
      success: true,
      data: comments,
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
