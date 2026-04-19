"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const complaint_routes_1 = __importDefault(require("./interfaces/routes/complaint.routes"));
const auth_routes_1 = __importDefault(require("./interfaces/routes/auth.routes"));
const notification_routes_1 = __importDefault(require("./interfaces/routes/notification.routes"));
const error_middleware_1 = require("./interfaces/middleware/error.middleware");
// Load env FIRST (important)
dotenv_1.default.config();
const app = (0, express_1.default)();
// -------------------------
// CORE MIDDLEWARES
// -------------------------
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// -------------------------
// ROUTES
// -------------------------
app.use("/auth", auth_routes_1.default);
app.use("/complaints", complaint_routes_1.default);
app.use("/notifications", notification_routes_1.default);
// -------------------------
// ERROR HANDLER (MUST BE LAST)
// -------------------------
app.use(error_middleware_1.errorHandler);
// -------------------------
// START SERVER
// -------------------------
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
