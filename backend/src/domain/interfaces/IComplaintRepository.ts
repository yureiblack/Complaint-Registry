import { Complaint } from "../entities/Complaint";

export interface IComplaintRepository {
  create(data: Complaint): Promise<Complaint>;
  findById(id: string): Promise<Complaint | null>;
  update(data: Complaint): Promise<Complaint>;
}