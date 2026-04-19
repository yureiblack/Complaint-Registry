"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const AuthService_1 = require("../../application/services/AuthService");
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const service = new AuthService_1.AuthService(new PrismaUserRepository_1.PrismaUserRepository());
const register = async (req, res) => {
    const { email, password, role } = req.body;
    // Validate role if provided
    if (role && !["USER", "ADMIN"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be USER or ADMIN" });
    }
    const user = await service.register(email, password, role || "USER");
    res.json(user);
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    // Get user info to include role in response
    const user = await new PrismaUserRepository_1.PrismaUserRepository().findByEmail(email);
    res.json({
        ...result,
        role: user?.role || "USER"
    });
};
exports.login = login;
