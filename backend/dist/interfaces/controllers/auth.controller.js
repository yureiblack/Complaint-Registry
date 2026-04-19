"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const AuthService_1 = require("../../application/services/AuthService");
const PrismaUserRepository_1 = require("../../infrastructure/repositories/PrismaUserRepository");
const service = new AuthService_1.AuthService(new PrismaUserRepository_1.PrismaUserRepository());
const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await service.register(email, password);
    res.json(user);
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    res.json(result);
};
exports.login = login;
