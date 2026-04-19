export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  createUser(data: { email: string; password: string; role?: "USER" | "ADMIN" }): Promise<any>;
}