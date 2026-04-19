"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComplaintRepository = void 0;
const db_1 = require("../../config/db");
const ComplaintMapper_1 = require("../mappers/ComplaintMapper");
class PrismaComplaintRepository {
    // -------------------------
    // CREATE
    // -------------------------
    async create(complaint) {
        const vis = complaint.getVisibility();
        const data = await db_1.prisma.complaint.create({
            data: {
                title: complaint.title,
                description: complaint.description,
                userId: complaint.userId,
                isPublic: vis.isPublic,
                isAnonymous: vis.isAnonymous,
                status: complaint.getStatus(),
            },
        });
        return ComplaintMapper_1.ComplaintMapper.toDomain(data);
    }
    // -------------------------
    // FIND BY ID
    // -------------------------
    async findById(id) {
        const data = await db_1.prisma.complaint.findUnique({
            where: { id },
        });
        return data ? ComplaintMapper_1.ComplaintMapper.toDomain(data) : null;
    }
    // -------------------------
    // UPDATE
    // -------------------------
    async update(complaint) {
        const vis = complaint.getVisibility();
        const data = await db_1.prisma.complaint.update({
            where: { id: complaint.id },
            data: {
                status: complaint.getStatus(),
                isPublic: vis.isPublic,
                isAnonymous: vis.isAnonymous,
            },
        });
        return ComplaintMapper_1.ComplaintMapper.toDomain(data);
    }
    // =====================================================
    // 🌐 PUBLIC SYSTEM
    // =====================================================
    async findPublic() {
        const data = await db_1.prisma.complaint.findMany({
            where: { isPublic: true },
            orderBy: { createdAt: "desc" },
        });
        return data.map((d) => ComplaintMapper_1.ComplaintMapper.toDomain(d));
    }
    async findByUser(userId) {
        const data = await db_1.prisma.complaint.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return data.map((d) => ComplaintMapper_1.ComplaintMapper.toDomain(d));
    }
    async search(query, userId, role) {
        const data = await db_1.prisma.complaint.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { title: { contains: query } },
                            { description: { contains: query } },
                        ],
                    },
                    ...(role !== "ADMIN"
                        ? [
                            {
                                OR: [
                                    { isPublic: true },
                                    { userId: userId },
                                ],
                            },
                        ]
                        : []),
                ],
            },
            orderBy: { createdAt: "desc" },
        });
        return data.map((d) => ComplaintMapper_1.ComplaintMapper.toDomain(d));
    }
}
exports.PrismaComplaintRepository = PrismaComplaintRepository;
