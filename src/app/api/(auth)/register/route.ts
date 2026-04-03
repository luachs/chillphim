import { connectDB } from "@/lib/db";
import { UserService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const user = await UserService.register(body);

    return NextResponse.json(
      { message: "Register success", user },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Register failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}
