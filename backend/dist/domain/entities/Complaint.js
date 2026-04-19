"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complaint = void 0;
const ComplaintStatus_1 = require("../enums/ComplaintStatus");
class Complaint {
    constructor(id, title, description, userId, isPublic = false, isAnonymous = false, status = ComplaintStatus_1.ComplaintStatus.SUBMITTED) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.isPublic = isPublic;
        this.isAnonymous = isAnonymous;
        this.status = status;
    }
    // -------------------------
    // GETTERS (Encapsulation)
    // -------------------------
    getStatus() {
        return this.status;
    }
    getVisibility() {
        return {
            isPublic: this.isPublic,
            isAnonymous: this.isAnonymous,
        };
    }
    // -------------------------
    // SERIALIZATION
    // -------------------------
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            userId: this.userId,
            status: this.status,
            isPublic: this.isPublic,
            isAnonymous: this.isAnonymous,
        };
    }
    // -------------------------
    // BUSINESS RULES
    // -------------------------
    updateVisibility(isPublic, isAnonymous) {
        // Rule: private complaints cannot be anonymous
        if (!isPublic && isAnonymous) {
            throw new Error("Private complaints cannot be anonymous");
        }
        this.isPublic = isPublic;
        this.isAnonymous = isAnonymous;
    }
    transitionTo(next) {
        const allowed = {
            [ComplaintStatus_1.ComplaintStatus.SUBMITTED]: [ComplaintStatus_1.ComplaintStatus.UNDER_REVIEW],
            [ComplaintStatus_1.ComplaintStatus.UNDER_REVIEW]: [ComplaintStatus_1.ComplaintStatus.IN_PROGRESS],
            [ComplaintStatus_1.ComplaintStatus.IN_PROGRESS]: [
                ComplaintStatus_1.ComplaintStatus.RESOLVED,
                ComplaintStatus_1.ComplaintStatus.REJECTED,
            ],
            [ComplaintStatus_1.ComplaintStatus.RESOLVED]: [ComplaintStatus_1.ComplaintStatus.CLOSED],
            [ComplaintStatus_1.ComplaintStatus.REJECTED]: [ComplaintStatus_1.ComplaintStatus.CLOSED],
            [ComplaintStatus_1.ComplaintStatus.CLOSED]: [],
        };
        if (!allowed[this.status].includes(next)) {
            throw new Error(`Invalid transition: ${this.status} → ${next}`);
        }
        this.status = next;
    }
    // -------------------------
    // FACTORY (FOR DB → DOMAIN)
    // -------------------------
    static fromPersistence(data) {
        return new Complaint(data.id, data.title, data.description, data.userId, data.isPublic, data.isAnonymous, data.status);
    }
}
exports.Complaint = Complaint;
