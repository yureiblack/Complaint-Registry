import { Request, Response } from "express";
import { ComplaintService } from "../../application/services/ComplaintService";
import { PrismaComplaintRepository } from "../../infrastructure/repositories/PrismaComplaintRepository";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";
import { AuthRequest } from "../middleware/auth.middleware";

const service = new ComplaintService(new PrismaComplaintRepository());

// Define params type
interface IdParams {
  id: string;
}

// CREATE
export const createComplaint = async (req: Request, res: Response) => {
  const result = await service.createComplaint(req.body);
  res.json(result);
};

export const getComplaint = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = req.params.id as string;

  const result = await service.getComplaintById(id, req.user);
  res.json(result);
};

export const updateStatus = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = req.params.id as string;

  const result = await service.updateStatus(
    id,
    req.body.status,
    req.user
  );

  res.json(result);
};