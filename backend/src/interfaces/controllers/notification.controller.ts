import { Request, Response } from "express";
import { NotificationService } from "../../application/services/NotificationService";
import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";
import { AuthRequest } from "../middleware/auth.middleware";

const service = new NotificationService(new NotificationRepository());

// -------------------------
// GET UNREAD NOTIFICATIONS
// -------------------------
export const getUnreadNotifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await service.getUserNotifications(req.user.userId);
    res.json(notifications);
  } catch (err: any) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// GET UNREAD COUNT
// -------------------------
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const count = await service.getUnreadCount(req.user.userId);
    res.json({ unreadCount: count });
  } catch (err: any) {
    console.error("GET UNREAD COUNT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// MARK AS READ
// -------------------------
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notificationId = req.params.id as string;
    await service.markAsRead(notificationId, req.user.userId);

    res.json({ message: "Notification marked as read" });
  } catch (err: any) {
    console.error("MARK AS READ ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

// -------------------------
// MARK ALL AS READ
// -------------------------
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await service.markAllAsRead(req.user.userId);
    res.json({ message: "All notifications marked as read" });
  } catch (err: any) {
    console.error("MARK ALL AS READ ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
