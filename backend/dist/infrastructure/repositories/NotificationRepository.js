"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const db_1 = require("../../config/db");
class NotificationRepository {
    async create(data) {
        return db_1.prisma.notification.create({
            data,
        });
    }
    async findUnreadByUser(userId) {
        return db_1.prisma.notification.findMany({
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
    async findById(id) {
        return db_1.prisma.notification.findUnique({
            where: { id },
        });
    }
    async markAsRead(id) {
        return db_1.prisma.notification.update({
            where: { id },
            data: {
                read: true,
                readAt: new Date(),
            },
        });
    }
    async markAllAsRead(userId) {
        return db_1.prisma.notification.updateMany({
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
    async getUnreadCount(userId) {
        return db_1.prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }
}
exports.NotificationRepository = NotificationRepository;
