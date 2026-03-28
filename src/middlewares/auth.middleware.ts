import { verifyToken } from "@/lib/jwt";

export const authMiddleware = (req: Request) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error("Invalid token");
  }

  return decoded; // chứa userId, role
};
