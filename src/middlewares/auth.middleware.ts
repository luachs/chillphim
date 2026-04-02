import { verifyToken } from "@/lib/jwt";

export const authMiddleware = (req: Request) => {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) {
    throw new Error("Unauthorized");
  }

  // lấy token từ cookie
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("=")),
  );

  const token = cookies.token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    throw new Error("Invalid token");
  }

  return decoded;
};
