"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const db_1 = require("../../config/db");
class PrismaUserRepository {
    async findByEmail(email) {
        return db_1.prisma.user.findUnique({ where: { email } });
    }
    async createUser(data) {
        return db_1.prisma.user.create({ data });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
