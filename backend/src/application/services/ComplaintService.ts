import { IComplaintRepository } from "../../domain/interfaces/IComplaintRepository";
import { Complaint } from "../../domain/entities/Complaint";
import { CreateComplaintDTO } from "../dto/CreateComplaint.dto";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";

import { ComplaintSubject } from "../../domain/observers/ComplaintSubject";
import { InAppNotifier } from "../../infrastructure/notifications/InAppNotifier";
import { EmailNotifier } from "../../infrastructure/notifications/EmailNotifier";

type RequestUser = {
  userId: string;
  role: string;
};

export class ComplaintService {
  private subject: ComplaintSubject;

  constructor(private repo: IComplaintRepository) {
    // 🔥 Initialize observer system
    this.subject = new ComplaintSubject();

    this.subject.subscribe(new InAppNotifier());
    this.subject.subscribe(new EmailNotifier());
  }

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

    const saved = await this.repo.create(complaint);

    // 🔔 Notify
    this.subject.notify("COMPLAINT_CREATED", saved.toJSON());

    return saved;
  }

  // -------------------------
  // GET
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
  // UPDATE STATUS
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

    complaint.transitionTo(status);

    const updated = await this.repo.update(complaint);

    // 🔔 Notify ALL observers
    this.subject.notify("STATUS_UPDATED", updated.toJSON());

    return updated;
  }

  // -------------------------
  // PUBLIC
  // -------------------------
  async getPublicComplaints() {
    return this.repo.findPublic();
  }

  async getMyComplaints(user: RequestUser) {
    return this.repo.findByUser(user.userId);
  }

  async search(query: string, user: RequestUser) {
    return this.repo.search(query, user.userId, user.role);
  }

  // -------------------------
  // VISIBILITY
  // -------------------------
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

    const updated = await this.repo.update(complaint);

    this.subject.notify("VISIBILITY_UPDATED", updated.toJSON());

    return updated;
  }
}