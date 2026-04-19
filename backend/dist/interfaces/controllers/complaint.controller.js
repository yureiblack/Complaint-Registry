"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVisibility = exports.search = exports.getMy = exports.getPublic = exports.updateStatus = exports.getComplaint = exports.createComplaint = void 0;
const ComplaintService_1 = require("../../application/services/ComplaintService");
const PrismaComplaintRepository_1 = require("../../infrastructure/repositories/PrismaComplaintRepository");
const service = new ComplaintService_1.ComplaintService(new PrismaComplaintRepository_1.PrismaComplaintRepository());
// -------------------------
// CREATE
// -------------------------
const createComplaint = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await service.createComplaint({
            ...req.body,
            userId: req.user.userId,
        });
        res.status(201).json(result.toJSON());
    }
    catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(400).json({ message: err.message });
    }
};
exports.createComplaint = createComplaint;
// -------------------------
// GET BY ID
// -------------------------
const getComplaint = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = req.params.id;
        const result = await service.getComplaintById(id, req.user);
        res.json(result.toJSON());
    }
    catch (err) {
        console.error("GET ERROR:", err);
        res.status(403).json({ message: err.message });
    }
};
exports.getComplaint = getComplaint;
// -------------------------
// UPDATE STATUS (ADMIN)
// -------------------------
const updateStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = req.params.id;
        const result = await service.updateStatus(id, req.body.status, req.user);
        res.json(result.toJSON());
    }
    catch (err) {
        console.error("STATUS UPDATE ERROR:", err);
        res.status(400).json({ message: err.message });
    }
};
exports.updateStatus = updateStatus;
// =====================================================
// 🌐 PUBLIC SYSTEM
// =====================================================
// -------------------------
// 🌐 PUBLIC FEED
// -------------------------
const getPublic = async (_req, res) => {
    try {
        const data = await service.getPublicComplaints();
        res.json(data.map((c) => c.toJSON()));
    }
    catch (err) {
        console.error("PUBLIC FEED ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getPublic = getPublic;
// -------------------------
// 👤 MY COMPLAINTS
// -------------------------
const getMy = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const data = await service.getMyComplaints(req.user);
        res.json(data.map((c) => c.toJSON()));
    }
    catch (err) {
        console.error("MY COMPLAINTS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMy = getMy;
// -------------------------
// 🔍 SEARCH
// -------------------------
const search = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const query = req.query.q || "";
        const data = await service.search(query, req.user);
        res.json(data.map((c) => c.toJSON()));
    }
    catch (err) {
        console.error("SEARCH ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.search = search;
// -------------------------
// 🔒 UPDATE VISIBILITY
// -------------------------
const updateVisibility = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = req.params.id;
        const result = await service.updateVisibility(id, req.body.isPublic, req.body.isAnonymous, req.user);
        res.json(result.toJSON());
    }
    catch (err) {
        console.error("VISIBILITY ERROR:", err);
        res.status(400).json({ message: err.message });
    }
};
exports.updateVisibility = updateVisibility;
