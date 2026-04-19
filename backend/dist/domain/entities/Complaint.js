"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complaint = void 0;
const ComplaintStatus_1 = require("../enums/ComplaintStatus");
class Complaint {
    constructor(id, // ✔ comes from Prisma
    title, description, userId, isPublic = false, isAnonymous = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.isPublic = isPublic;
        this.isAnonymous = isAnonymous;
        this.status = ComplaintStatus_1.ComplaintStatus.SUBMITTED;
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
            isAnonymous: this.isAnonymous
        };
    }
    // -------------------------
    // BUSINESS RULES
    // -------------------------
    updateVisibility(isPublic, isAnonymous) {
        this.isPublic = isPublic;
        this.isAnonymous = isAnonymous;
    }
    transitionTo(next) {
        const allowed = {
            [ComplaintStatus_1.ComplaintStatus.SUBMITTED]: [ComplaintStatus_1.ComplaintStatus.UNDER_REVIEW],
            [ComplaintStatus_1.ComplaintStatus.UNDER_REVIEW]: [ComplaintStatus_1.ComplaintStatus.IN_PROGRESS],
            [ComplaintStatus_1.ComplaintStatus.IN_PROGRESS]: [
                ComplaintStatus_1.ComplaintStatus.RESOLVED,
                ComplaintStatus_1.ComplaintStatus.REJECTED
            ],
            [ComplaintStatus_1.ComplaintStatus.RESOLVED]: [ComplaintStatus_1.ComplaintStatus.CLOSED],
            [ComplaintStatus_1.ComplaintStatus.REJECTED]: [ComplaintStatus_1.ComplaintStatus.CLOSED],
            [ComplaintStatus_1.ComplaintStatus.CLOSED]: []
        };
        if (!allowed[this.status].includes(next)) {
            throw new Error(`Invalid transition: ${this.status} → ${next}`);
        }
        this.status = next;
    }
}
exports.Complaint = Complaint;
