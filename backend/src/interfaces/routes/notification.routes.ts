import express from "express";
import {
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// All notification routes require authentication
router.get("/unread", authMiddleware, getUnreadNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.patch("/:id/read", authMiddleware, markAsRead);
router.patch("/read-all", authMiddleware, markAllAsRead);

export default router;
