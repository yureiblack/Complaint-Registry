import { IComplaintRepository } from "../../domain/interfaces/IComplaintRepository";
import { Complaint } from "../../domain/entities/Complaint";
import { CreateComplaintDTO } from "../dto/CreateComplaint.dto";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";

type RequestUser = {
  userId: string;
  role: string;
};

export class ComplaintService {
  constructor(private repo: IComplaintRepository) {}

  // -------------------------
  // CREATE
  // -------------------------
  async createComplaint(dto: CreateComplaintDTO): Promise<Complaint> {
    const complaint = new Complaint(
      "",
      dto.title,
      dto.description,
      dto.userId
    );

    return this.repo.create(complaint);
  }

  // -------------------------
  // GET BY ID (RBAC)
  // -------------------------
  async getComplaintById(id: string, requester: RequestUser) {
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

  // -------------------------
  // UPDATE STATUS (ADMIN ONLY)
  // -------------------------
  async updateStatus(
    id: string,
    status: ComplaintStatus,
    requester: RequestUser
  ) {
    if (requester.role !== "ADMIN") {
      throw new Error("Only admin can update status");
    }

    const complaint = await this.repo.findById(id);
    if (!complaint) throw new Error("Complaint not found");

    // ✅ Domain handles lifecycle
    complaint.transitionTo(status);

    return this.repo.update(complaint);
  }

  // =====================================================
  // 🌐 PUBLIC SYSTEM (NEW — ADD THESE)
  // =====================================================

  // 🌐 PUBLIC FEED
  async getPublicComplaints() {
    return this.repo.findPublic();
  }

  // 👤 MY COMPLAINTS
  async getMyComplaints(user: RequestUser) {
    return this.repo.findByUser(user.userId);
  }

  // 🔍 SEARCH WITH VISIBILITY RULES
  async search(query: string, user: RequestUser) {
    return this.repo.search(query, user.userId, user.role);
  }

  // 🔒 UPDATE VISIBILITY
  async updateVisibility(
    id: string,
    isPublic: boolean,
    isAnonymous: boolean,
    user: RequestUser
  ) {
    const complaint = await this.repo.findById(id);
    if (!complaint) throw new Error("Complaint not found");

    if (
      user.role !== "ADMIN" &&
      complaint.userId !== user.userId
    ) {
      throw new Error("Forbidden");
    }

    complaint.updateVisibility(isPublic, isAnonymous);

    return this.repo.update(complaint);
  }
}