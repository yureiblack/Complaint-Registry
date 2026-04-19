"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getUnreadNotifications = void 0;
const NotificationService_1 = require("../../application/services/NotificationService");
const NotificationRepository_1 = require("../../infrastructure/repositories/NotificationRepository");
const service = new NotificationService_1.NotificationService(new NotificationRepository_1.NotificationRepository());
// -------------------------
// GET UNREAD NOTIFICATIONS
// -------------------------
const getUnreadNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const notifications = await service.getUserNotifications(req.user.userId);
        res.json(notifications);
    }
    catch (err) {
        console.error("GET NOTIFICATIONS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getUnreadNotifications = getUnreadNotifications;
// -------------------------
// GET UNREAD COUNT
// -------------------------
const getUnreadCount = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const count = await service.getUnreadCount(req.user.userId);
        res.json({ unreadCount: count });
    }
    catch (err) {
        console.error("GET UNREAD COUNT ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getUnreadCount = getUnreadCount;
// -------------------------
// MARK AS READ
// -------------------------
const markAsRead = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const notificationId = req.params.id;
        await service.markAsRead(notificationId, req.user.userId);
        res.json({ message: "Notification marked as read" });
    }
    catch (err) {
        console.error("MARK AS READ ERROR:", err);
        res.status(400).json({ message: err.message });
    }
};
exports.markAsRead = markAsRead;
// -------------------------
// MARK ALL AS READ
// -------------------------
const markAllAsRead = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await service.markAllAsRead(req.user.userId);
        res.json({ message: "All notifications marked as read" });
    }
    catch (err) {
        console.error("MARK ALL AS READ ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.markAllAsRead = markAllAsRead;
