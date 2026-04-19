import { prisma } from "../../config/db";
import { IComplaintRepository } from "../../domain/interfaces/IComplaintRepository";
import { Complaint } from "../../domain/entities/Complaint";

export class PrismaComplaintRepository implements IComplaintRepository {
  async create(complaint: Complaint): Promise<Complaint> {
    const saved = await prisma.complaint.create({
      data: {
        title: complaint.title,
        description: complaint.description,
        userId: complaint.userId
      }
    });

    return new Complaint(
      saved.id,
      saved.title,
      saved.description,
      saved.userId
    );
  }

  async findById(id: string): Promise<Complaint | null> {
    const data = await prisma.complaint.findUnique({ where: { id } });

    if (!data) return null;

    return new Complaint(
      data.id,
      data.title,
      data.description,
      data.userId
    );
  }

  async update(complaint: Complaint): Promise<Complaint> {
    const updated = await prisma.complaint.update({
      where: { id: complaint.id },
      data: {
        title: complaint.title,
        description: complaint.description
      }
    });

    return new Complaint(
      updated.id,
      updated.title,
      updated.description,
      updated.userId
    );
  }
}