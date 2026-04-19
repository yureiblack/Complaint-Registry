"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All notification routes require authentication
router.get("/unread", auth_middleware_1.authMiddleware, notification_controller_1.getUnreadNotifications);
router.get("/unread-count", auth_middleware_1.authMiddleware, notification_controller_1.getUnreadCount);
router.patch("/:id/read", auth_middleware_1.authMiddleware, notification_controller_1.markAsRead);
router.patch("/read-all", auth_middleware_1.authMiddleware, notification_controller_1.markAllAsRead);
exports.default = router;
