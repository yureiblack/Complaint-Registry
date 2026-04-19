"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintService = void 0;
const Complaint_1 = require("../../domain/entities/Complaint");
class ComplaintService {
    constructor(repo) {
        this.repo = repo;
    }
    async createComplaint(dto) {
        const complaint = new Complaint_1.Complaint("", dto.title, dto.description, dto.userId);
        return this.repo.create(complaint);
    }
    async getComplaintById(id, requester) {
        const complaint = await this.repo.findById(id);
        if (!complaint)
            throw new Error("Complaint not found");
        if (requester.role !== "ADMIN" &&
            complaint.userId !== requester.userId) {
            throw new Error("Forbidden");
        }
        return complaint;
    }
    async updateStatus(id, status, requester) {
        if (requester.role !== "ADMIN") {
            throw new Error("Only admin can update status");
        }
        const complaint = await this.repo.findById(id);
        if (!complaint)
            throw new Error("Complaint not found");
        complaint.transitionTo(status);
        return this.repo.update(complaint);
    }
}
exports.ComplaintService = ComplaintService;
