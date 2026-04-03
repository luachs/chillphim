import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { getMovieBySlugService } from "@/services/movie.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    await connectDB();

    const movie = await getMovieBySlugService(params.slug);

    if (!movie) {
      return NextResponse.json(
        {
          success: false,
          message: "Movie not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch movie";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
