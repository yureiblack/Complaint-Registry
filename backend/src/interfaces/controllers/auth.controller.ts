import { Request, Response } from "express";
import { AuthService } from "../../application/services/AuthService";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";

const service = new AuthService(new PrismaUserRepository());

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await service.register(email, password);
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await service.login(email, password);
  res.json(result);
};