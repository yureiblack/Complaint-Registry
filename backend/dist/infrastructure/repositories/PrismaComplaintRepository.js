"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComplaintRepository = void 0;
const db_1 = require("../../config/db");
const Complaint_1 = require("../../domain/entities/Complaint");
class PrismaComplaintRepository {
    async create(complaint) {
        const saved = await db_1.prisma.complaint.create({
            data: {
                title: complaint.title,
                description: complaint.description,
                userId: complaint.userId
            }
        });
        return new Complaint_1.Complaint(saved.id, saved.title, saved.description, saved.userId);
    }
    async findById(id) {
        const data = await db_1.prisma.complaint.findUnique({ where: { id } });
        if (!data)
            return null;
        return new Complaint_1.Complaint(data.id, data.title, data.description, data.userId);
    }
    async update(complaint) {
        const updated = await db_1.prisma.complaint.update({
            where: { id: complaint.id },
            data: {
                title: complaint.title,
                description: complaint.description
            }
        });
        return new Complaint_1.Complaint(updated.id, updated.title, updated.description, updated.userId);
    }
}
exports.PrismaComplaintRepository = PrismaComplaintRepository;
