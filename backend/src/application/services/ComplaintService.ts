import { IComplaintRepository } from "../../domain/interfaces/IComplaintRepository";
import { Complaint } from "../../domain/entities/Complaint";
import { CreateComplaintDTO } from "../dto/CreateComplaint.dto";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";

export class ComplaintService {
  constructor(private repo: IComplaintRepository) {}

  // -------------------------
  // CREATE COMPLAINT
  // -------------------------
  async createComplaint(dto: CreateComplaintDTO): Promise<Complaint> {
    const complaint = new Complaint(
      "", // id will be replaced by DB
      dto.title,
      dto.description,
      dto.userId
    );

    const saved = await this.repo.create(complaint);
    return saved;
  }

  // -------------------------
  // GET COMPLAINT
  // -------------------------
  async getComplaintById(id: string) {
    return this.repo.findById(id);
  }

  // -------------------------
  // STATUS TRANSITION
  // -------------------------
  async updateStatus(id: string, status: ComplaintStatus) {
    const complaint = await this.repo.findById(id);
    if (!complaint) throw new Error("Complaint not found");

    complaint.transitionTo(status);

    return this.repo.update(complaint);
  }
}