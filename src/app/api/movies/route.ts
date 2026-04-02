import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import {
  createMovieService,
  getAllMoviesService,
} from "@/services/movie.service";

// CREATE MOVIE
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const movie = await createMovieService(body);

    return NextResponse.json({
      success: true,
      data: movie,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// GET ALL MOVIES
export async function GET() {
  try {
    await connectDB();

    const movies = await getAllMoviesService();

    return NextResponse.json({
      success: true,
      data: movies,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
