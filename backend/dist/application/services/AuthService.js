"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async register(email, password, role) {
        const existing = await this.userRepo.findByEmail(email);
        if (existing)
            throw new Error("User already exists");
        const hashed = await bcrypt_1.default.hash(password, 10);
        return this.userRepo.createUser({
            email,
            password: hashed,
            role,
        });
    }
    async login(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, env_1.JWT_SECRET, { expiresIn: "1d" });
        return { token };
    }
}
exports.AuthService = AuthService;
