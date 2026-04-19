import { Role } from "../enums/Role";

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public role: Role
  ) {}

  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
}