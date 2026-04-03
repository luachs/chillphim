import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCollectionBySlug } from "@/services/collection.service";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    await connectDB();

    const collection = await getCollectionBySlug(params.slug);

    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
