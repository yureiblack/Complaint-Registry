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
// GET BY ID
const getComplaint = async (req, res) => {
    const result = await service.getComplaintById(req.params.id);
    res.json(result);
};
exports.getComplaint = getComplaint;
// UPDATE STATUS
const updateStatus = async (req, res) => {
    const result = await service.updateStatus(req.params.id, req.body.status);
    res.json(result);
};
exports.updateStatus = updateStatus;
