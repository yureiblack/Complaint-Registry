"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintService = void 0;
const Complaint_1 = require("../../domain/entities/Complaint");
const ComplaintSubject_1 = require("../../domain/observers/ComplaintSubject");
const InAppNotifier_1 = require("../../infrastructure/notifications/InAppNotifier");
const EmailNotifier_1 = require("../../infrastructure/notifications/EmailNotifier");
class ComplaintService {
    constructor(repo) {
        this.repo = repo;
        this.subject = new ComplaintSubject_1.ComplaintSubject();
        this.subject.subscribe(new InAppNotifier_1.InAppNotifier());
        this.subject.subscribe(new EmailNotifier_1.EmailNotifier());
    }
    // -------------------------
    // CREATE
    // -------------------------
    async createComplaint(dto) {
        const title = dto.title?.trim();
        const description = dto.description?.trim();
        if (!title) {
            throw new Error("Title is required");
        }
        if (!description) {
            throw new Error("Description is required");
        }
        if (title.length < 3) {
            throw new Error("Title must be at least 3 characters long");
        }
        if (title.length > 150) {
            throw new Error("Title cannot exceed 150 characters");
        }
        if (description.length < 10) {
            throw new Error("Description must be at least 10 characters long");
        }
        if (description.length > 5000) {
            throw new Error("Description cannot exceed 5000 characters");
        }
        const complaint = new Complaint_1.Complaint("", title, description, dto.userId);
        const saved = await this.repo.create(complaint);
        this.subject.notify("COMPLAINT_CREATED", saved.toJSON());
        return saved;
    }
    // -------------------------
    // GET
    // -------------------------
    async getComplaintById(id, requester) {
        const complaint = await this.repo.findById(id);
        if (!complaint)
            throw new Error("Complaint not found");
        if (requester.role !== "ADMIN" && complaint.userId !== requester.userId) {
            throw new Error("Forbidden");
        }
        return complaint;
    }
    // -------------------------
    // UPDATE STATUS
    // -------------------------
    async updateStatus(id, status, requester) {
        if (requester.role !== "ADMIN") {
            throw new Error("Only admin can update status");
        }
        const complaint = await this.repo.findById(id);
        if (!complaint)
            throw new Error("Complaint not found");
        complaint.transitionTo(status);
        const updated = await this.repo.update(complaint);
        this.subject.notify("STATUS_UPDATED", updated.toJSON());
        return updated;
    }
    // -------------------------
    // PUBLIC
    // -------------------------
    async getPublicComplaints() {
        return this.repo.findPublic();
    }
    async getMyComplaints(user) {
        return this.repo.findByUser(user.userId);
    }
    async search(query, user) {
        return this.repo.search(query, user.userId, user.role);
    }
    // -------------------------
    // VISIBILITY
    // -------------------------
    async updateVisibility(id, isPublic, isAnonymous, user) {
        const complaint = await this.repo.findById(id);
        if (!complaint)
            throw new Error("Complaint not found");
        if (user.role !== "ADMIN" && complaint.userId !== user.userId) {
            throw new Error("Forbidden");
        }
        complaint.updateVisibility(isPublic, isAnonymous);
        const updated = await this.repo.update(complaint);
        this.subject.notify("VISIBILITY_UPDATED", updated.toJSON());
        return updated;
    }
}
exports.ComplaintService = ComplaintService;
