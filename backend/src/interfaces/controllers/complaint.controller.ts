import { Request, Response } from "express";
import { ComplaintService } from "../../application/services/ComplaintService";
import { PrismaComplaintRepository } from "../../infrastructure/repositories/PrismaComplaintRepository";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";
import { AuthRequest } from "../middleware/auth.middleware";

const service = new ComplaintService(new PrismaComplaintRepository());

// -------------------------
// CREATE
// -------------------------
export const createComplaint = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.createComplaint({
      ...req.body,
      userId: req.user.userId,
    });

    res.status(201).json(result.toJSON());
  } catch (err: any) {
    console.error("CREATE ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

// -------------------------
// GET BY ID
// -------------------------
export const getComplaint = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id as string;

    const result = await service.getComplaintById(id, req.user);
    res.json(result.toJSON());
  } catch (err: any) {
    console.error("GET ERROR:", err);
    res.status(403).json({ message: err.message });
  }
};

// -------------------------
// UPDATE STATUS (ADMIN)
// -------------------------
export const updateStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id as string;

    const result = await service.updateStatus(
      id,
      req.body.status as ComplaintStatus,
      req.user
    );

    res.json(result.toJSON());
  } catch (err: any) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

// =====================================================
// 🌐 PUBLIC SYSTEM
// =====================================================

// -------------------------
// 🌐 PUBLIC FEED
// -------------------------
export const getPublic = async (_req: Request, res: Response) => {
  try {
    const data = await service.getPublicComplaints();
    res.json(data.map((c) => c.toJSON()));
  } catch (err: any) {
    console.error("PUBLIC FEED ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// 👤 MY COMPLAINTS
// -------------------------
export const getMy = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await service.getMyComplaints(req.user);
    res.json(data.map((c) => c.toJSON()));
  } catch (err: any) {
    console.error("MY COMPLAINTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// 🔍 SEARCH
// -------------------------
export const search = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const query = (req.query.q as string) || "";

    const data = await service.search(query, req.user);
    res.json(data.map((c) => c.toJSON()));
  } catch (err: any) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------------
// 🔒 UPDATE VISIBILITY
// -------------------------
export const updateVisibility = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.params.id as string;

    const result = await service.updateVisibility(
      id,
      req.body.isPublic,
      req.body.isAnonymous,
      req.user
    );

    res.json(result.toJSON());
  } catch (err: any) {
    console.error("VISIBILITY ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};