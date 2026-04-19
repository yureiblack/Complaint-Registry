import { IComplaintRepository } from "../../domain/interfaces/IComplaintRepository";
import { Complaint } from "../../domain/entities/Complaint";
import { CreateComplaintDTO } from "../dto/CreateComplaint.dto";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";
import { canTransition } from "../../domain/policies/ComplaintLifecycle";

export class ComplaintService {
  constructor(private repo: IComplaintRepository) {}

  async createComplaint(dto: CreateComplaintDTO): Promise<Complaint> {
    const complaint = new Complaint(
      "",
      dto.title,
      dto.description,
      dto.userId
    );

    return this.repo.create(complaint);
  }

  async getComplaintById(id: string, requester: any) {
    const complaint = await this.repo.findById(id);
    if (!complaint) throw new Error("Complaint not found");

    if (
      requester.role !== "ADMIN" &&
      complaint.userId !== requester.userId
    ) {
      throw new Error("Forbidden");
    }

    return complaint;
  }

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    requester: any
  ) {
    if (requester.role !== "ADMIN") {
      throw new Error("Only admin can update status");
    }

    const complaint = await this.repo.findById(id);
    if (!complaint) throw new Error("Complaint not found");

    complaint.transitionTo(status);

    return this.repo.update(complaint);
  }
}