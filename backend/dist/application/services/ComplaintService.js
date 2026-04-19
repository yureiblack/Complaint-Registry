"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintService = void 0;
const Complaint_1 = require("../../domain/entities/Complaint");
class ComplaintService {
    constructor(repo) {
        this.repo = repo;
    }
    // -------------------------
    // CREATE COMPLAINT
    // -------------------------
    async createComplaint(dto) {
        const complaint = new Complaint_1.Complaint("", // id will be replaced by DB
        dto.title, dto.description, dto.userId);
        const saved = await this.repo.create(complaint);
        return saved;
    }
    // -------------------------
    // GET COMPLAINT
    // -------------------------
    async getComplaintById(id) {
        return this.repo.findById(id);
    }
    // -------------------------
    // STATUS TRANSITION
    // -------------------------
    async updateStatus(id, status) {
        const complaint = await this.repo.findById(id);
        if (!complaint)
            throw new Error("Complaint not found");
        complaint.transitionTo(status);
        return this.repo.update(complaint);
    }
}
exports.ComplaintService = ComplaintService;
