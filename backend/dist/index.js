"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaint_routes_1 = __importDefault(require("./interfaces/routes/complaint.routes"));
const auth_routes_1 = __importDefault(require("./interfaces/routes/auth.routes"));
const error_middleware_1 = require("./interfaces/middleware/error.middleware");
const app = (0, express_1.default)();
app.use(error_middleware_1.errorHandler);
app.use(express_1.default.json());
app.use("/complaints", complaint_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
