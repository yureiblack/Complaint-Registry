import { Request, Response } from "express";
import { ComplaintService } from "../../application/services/ComplaintService";
import { PrismaComplaintRepository } from "../../infrastructure/repositories/PrismaComplaintRepository";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";

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

// GET BY ID
export const getComplaint = async (
  req: Request<IdParams>,
  res: Response
) => {
  const result = await service.getComplaintById(req.params.id);
  res.json(result);
};

// UPDATE STATUS
export const updateStatus = async (
  req: Request<IdParams>,
  res: Response
) => {
  const result = await service.updateStatus(
    req.params.id,
    req.body.status as ComplaintStatus
  );

  res.json(result);
};