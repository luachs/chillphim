import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "UP",
      uptime: process.uptime(),
      message: "ChillPhim is running smoothly",
    },
    { status: 200 },
  );
}
