import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  getAllCollections,
  createCollection,
} from "@/services/collection.service";

export async function GET() {
  try {
    await connectDB();

    const collections = await getAllCollections();

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// POST /api/collections
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const collection = await createCollection(body);

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 400 },
    );
  }
}
