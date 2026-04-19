import { Complaint } from "../../domain/entities/Complaint";
import { ComplaintStatus } from "../../domain/enums/ComplaintStatus";
import { Complaint as PrismaComplaint } from "@prisma/client";

export class ComplaintMapper {
  static toDomain(data: PrismaComplaint): Complaint {
    return new Complaint(
      data.id,
      data.title,
      data.description,
      data.userId,
      data.isPublic,
      data.isAnonymous,
      data.status as unknown as ComplaintStatus 
    );
  }
}