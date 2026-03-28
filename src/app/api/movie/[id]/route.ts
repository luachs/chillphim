import { connectDB } from "@/lib/db";
import { MovieService } from "@/services/movie.service";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();
    const movie = await MovieService.getById(params.id);
    return NextResponse.json({ data: movie });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const user: any = authMiddleware(req);
    if (user.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const movie = await MovieService.update(params.id, body);
    return NextResponse.json({ message: "Update success", data: movie });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();
    const user: any = authMiddleware(req);
    if (user.role !== "admin")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await MovieService.delete(params.id);
    return NextResponse.json({ message: "Delete success" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
