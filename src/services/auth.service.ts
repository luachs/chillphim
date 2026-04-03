import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export const UserService = {
  // Logic Đăng ký
  register: async (data: { username: string; email: string; password: string }) => {
    const { username, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return user;
  },

  // Logic Đăng nhập
  login: async (data: { email: string; password: string }) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Wrong password");

    const token = signToken({ userId: user._id, role: user.role });

    return { user, token };
  },
};
