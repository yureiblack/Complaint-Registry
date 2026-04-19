import { prisma } from "../../config/db";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; password: string; role?: "USER" | "ADMIN" }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role || "USER",
      },
    });
  }
}