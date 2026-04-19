import { ComplaintObserver } from "../../domain/observers/ComplaintObserver";
import { NotificationService } from "../../application/services/NotificationService";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { prisma } from "../../config/db";

export class InAppNotifier implements ComplaintObserver {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService(
      new NotificationRepository()
    );
  }

  async update(event: string, data: any): Promise<void> {
    try {
      console.log("🔔 InAppNotifier received event:", event, data.id, data.userId);

      if (event === "COMPLAINT_CREATED") {
        // Notify all admins about new complaint
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
        });

        console.log("📢 Notifying admins of new complaint:", data.title, "from", user?.email);

        await this.notificationService.notifyAdminsOfNewComplaint(
          data.id,
          data.title,
          user?.email || "Unknown User"
        );

        console.log("✅ Admins notified");
      } else if (event === "STATUS_UPDATED") {
        // Notify complaint owner about status change
        console.log("📢 Notifying complaint owner of status update:", data.status);

        await this.notificationService.notifyComplaintOwner(
          data.id,
          data.userId,
          data.status
        );

        console.log("✅ Complaint owner notified");
      }
      // VISIBILITY_UPDATED does not trigger notifications
    } catch (err) {
      console.error("📧 Error creating in-app notification:", err);
    }
  }
}