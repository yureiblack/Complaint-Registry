import { prisma } from "../../config/db";
import { Complaint } from "../../domain/entities/Complaint";
import { IComplaintRepository } from "../../domain/interfaces/IComplaintRepository";
import { ComplaintMapper } from "../mappers/ComplaintMapper";

export class PrismaComplaintRepository implements IComplaintRepository {

  // -------------------------
  // CREATE
  // -------------------------
  async create(complaint: Complaint): Promise<Complaint> {
    const vis = complaint.getVisibility();

    const data = await prisma.complaint.create({
      data: {
        title: complaint.title,
        description: complaint.description,
        userId: complaint.userId,
        isPublic: vis.isPublic,
        isAnonymous: vis.isAnonymous,
        status: complaint.getStatus(),
      },
    });

    return ComplaintMapper.toDomain(data);
  }

  // -------------------------
  // FIND BY ID
  // -------------------------
  async findById(id: string): Promise<Complaint | null> {
    const data = await prisma.complaint.findUnique({
      where: { id },
    });

    return data ? ComplaintMapper.toDomain(data) : null;
  }

  // -------------------------
  // UPDATE
  // -------------------------
  async update(complaint: Complaint): Promise<Complaint> {
    const vis = complaint.getVisibility();

    const data = await prisma.complaint.update({
      where: { id: complaint.id },
      data: {
        status: complaint.getStatus(),
        isPublic: vis.isPublic,
        isAnonymous: vis.isAnonymous,
      },
    });

    return ComplaintMapper.toDomain(data);
  }

  // =====================================================
  // 🌐 PUBLIC SYSTEM
  // =====================================================

  async findPublic(): Promise<Complaint[]> {
    const data = await prisma.complaint.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
    });

    return data.map((d) => ComplaintMapper.toDomain(d));
  }

  async findByUser(userId: string): Promise<Complaint[]> {
    const data = await prisma.complaint.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return data.map((d) => ComplaintMapper.toDomain(d));
  }

  async search(
    query: string,
    userId: string,
    role: string
  ): Promise<Complaint[]> {
    const data = await prisma.complaint.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          },
          ...(role !== "ADMIN"
            ? [
                {
                  OR: [
                    { isPublic: true },
                    { userId: userId },
                  ],
                },
              ]
            : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return data.map((d) => ComplaintMapper.toDomain(d));
  }
}