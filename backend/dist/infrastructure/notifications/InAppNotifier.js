"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppNotifier = void 0;
const NotificationService_1 = require("../../application/services/NotificationService");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const db_1 = require("../../config/db");
class InAppNotifier {
    constructor() {
        this.notificationService = new NotificationService_1.NotificationService(new NotificationRepository_1.NotificationRepository());
    }
    async update(event, data) {
        try {
            console.log("🔔 InAppNotifier received event:", event, data.id, data.userId);
            if (event === "COMPLAINT_CREATED") {
                // Notify all admins about new complaint
                const user = await db_1.prisma.user.findUnique({
                    where: { id: data.userId },
                });
                console.log("📢 Notifying admins of new complaint:", data.title, "from", user?.email);
                await this.notificationService.notifyAdminsOfNewComplaint(data.id, data.title, user?.email || "Unknown User");
                console.log("✅ Admins notified");
            }
            else if (event === "STATUS_UPDATED") {
                // Notify complaint owner about status change
                console.log("📢 Notifying complaint owner of status update:", data.status);
                await this.notificationService.notifyComplaintOwner(data.id, data.userId, data.status);
                console.log("✅ Complaint owner notified");
            }
            // VISIBILITY_UPDATED does not trigger notifications
        }
        catch (err) {
            console.error("📧 Error creating in-app notification:", err);
        }
    }
}
exports.InAppNotifier = InAppNotifier;
