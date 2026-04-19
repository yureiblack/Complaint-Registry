"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintMapper = void 0;
const Complaint_1 = require("../../domain/entities/Complaint");
class ComplaintMapper {
    static toDomain(data) {
        return new Complaint_1.Complaint(data.id, data.title, data.description, data.userId, data.isPublic, data.isAnonymous, data.status);
    }
}
exports.ComplaintMapper = ComplaintMapper;
