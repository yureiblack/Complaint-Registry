"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const db_1 = require("../../config/db");
class NotificationService {
    constructor(repo) {
        this.repo = repo;
    }
    async notifyAdminsOfNewComplaint(complaintId, complaintTitle, creatorEmail) {
        // Find all admin users
        const admins = await db_1.prisma.user.findMany({
            where: { role: "ADMIN" },
        });
        // Create notification for each admin
        for (const admin of admins) {
            await this.repo.create({
                userId: admin.id,
                complaintId,
                eventType: "COMPLAINT_CREATED",
                message: `New complaint: "${complaintTitle}" from ${creatorEmail}`,
            });
        }
    }
    async notifyComplaintOwner(complaintId, complaintOwnerId, newStatus) {
        await this.repo.create({
            userId: complaintOwnerId,
            complaintId,
            eventType: "STATUS_UPDATED",
            message: `Your complaint status has been updated to: ${newStatus}`,
        });
    }
    async getUserNotifications(userId) {
        return this.repo.findUnreadByUser(userId);
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.repo.findById(notificationId);
        if (!notification) {
            throw new Error("Notification not found");
        }
        if (notification.userId !== userId) {
            throw new Error("Unauthorized");
        }
        return this.repo.markAsRead(notificationId);
    }
    async markAllAsRead(userId) {
        return this.repo.markAllAsRead(userId);
    }
    async getUnreadCount(userId) {
        return this.repo.getUnreadCount(userId);
    }
}
exports.NotificationService = NotificationService;
