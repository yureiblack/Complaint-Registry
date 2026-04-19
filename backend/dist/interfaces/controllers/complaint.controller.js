"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getComplaint = exports.createComplaint = void 0;
const ComplaintService_1 = require("../../application/services/ComplaintService");
const PrismaComplaintRepository_1 = require("../../infrastructure/repositories/PrismaComplaintRepository");
const service = new ComplaintService_1.ComplaintService(new PrismaComplaintRepository_1.PrismaComplaintRepository());
// CREATE
const createComplaint = async (req, res) => {
    const result = await service.createComplaint(req.body);
    res.json(result);
};
exports.createComplaint = createComplaint;
const getComplaint = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const id = req.params.id;
    const result = await service.getComplaintById(id, req.user);
    res.json(result);
};
exports.getComplaint = getComplaint;
const updateStatus = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const id = req.params.id;
    const result = await service.updateStatus(id, req.body.status, req.user);
    res.json(result);
};
exports.updateStatus = updateStatus;
