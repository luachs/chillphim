import { connectDB } from "@/lib/db";
import { UserService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { user, token } = await UserService.login(body);

    return NextResponse.json({ message: "Login success", token, user });
  } catch (error: any) {
    const status = error.message === "User not found" ? 404 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
}
