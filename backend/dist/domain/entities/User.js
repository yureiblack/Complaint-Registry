"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Role_1 = require("../enums/Role");
class User {
    constructor(id, email, password, role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    isAdmin() {
        return this.role === Role_1.Role.ADMIN;
    }
}
exports.User = User;
