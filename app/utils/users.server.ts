import type { RegisterForm } from "./types.server";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      pofile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  });

  return {
    id: newUser.id,
    email: user.email,
  };
};
