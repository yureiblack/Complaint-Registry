import { prisma } from "../../config/db";

export class NotificationRepository {
  async create(data: {
    userId: string;
    complaintId: string;
    eventType: string;
    message: string;
  }) {
    return prisma.notification.create({
      data,
    });
  }

  async findUnreadByUser(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        read: false,
      },
      include: {
        complaint: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }
}
