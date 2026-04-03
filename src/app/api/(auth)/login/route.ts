import { connectDB } from "@/lib/db";
import { UserService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { user, token } = await UserService.login(body);

    // 🔥 set cookie
    const response = NextResponse.json({
      message: "Login success",
      user,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // true khi deploy HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
      path: "/",
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}
