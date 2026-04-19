import { Request, Response } from "express";
import { AuthService } from "../../application/services/AuthService";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

const service = new AuthService(new PrismaUserRepository());

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  // Validate role if provided
  if (role && !["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Invalid role. Must be USER or ADMIN" });
  }

  const user = await service.register(email, password, role || "USER");
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await service.login(email, password);

  // Get user info to include role in response
  const user = await new PrismaUserRepository().findByEmail(email);

  res.json({
    ...result,
    role: user?.role || "USER"
  });
};