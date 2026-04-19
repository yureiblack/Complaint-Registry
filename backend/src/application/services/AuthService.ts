import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { JWT_SECRET } from "../../config/env";

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(email: string, password: string, role?: "USER" | "ADMIN") {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    return this.userRepo.createUser({
      email,
      password: hashed,
      role,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  }
}