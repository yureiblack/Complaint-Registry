import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";
import { prisma } from "../../config/db";

export class NotificationService {
  constructor(private repo: NotificationRepository) {}

  async notifyAdminsOfNewComplaint(
    complaintId: string,
    complaintTitle: string,
    creatorEmail: string
  ) {
    // Find all admin users
    const admins = await prisma.user.findMany({
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

  async notifyComplaintOwner(
    complaintId: string,
    complaintOwnerId: string,
    newStatus: string
  ) {
    await this.repo.create({
      userId: complaintOwnerId,
      complaintId,
      eventType: "STATUS_UPDATED",
      message: `Your complaint status has been updated to: ${newStatus}`,
    });
  }

  async getUserNotifications(userId: string) {
    return this.repo.findUnreadByUser(userId);
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.repo.findById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return this.repo.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    return this.repo.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string) {
    return this.repo.getUnreadCount(userId);
  }
}
