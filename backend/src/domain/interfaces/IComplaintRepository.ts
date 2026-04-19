import { Complaint } from "../entities/Complaint";

export interface IComplaintRepository {
  create(data: Complaint): Promise<Complaint>;

  findById(id: string): Promise<Complaint | null>;

  update(data: Complaint): Promise<Complaint>;

  findPublic(): Promise<Complaint[]>;

  findByUser(userId: string): Promise<Complaint[]>;

  search(
    query: string,
    userId: string,
    role: string
  ): Promise<Complaint[]>;
}