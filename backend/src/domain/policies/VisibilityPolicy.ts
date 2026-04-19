import { Complaint } from "../entities/Complaint";
import { User } from "../entities/User";

export interface VisibilityPolicy {
  canView(user: User, complaint: Complaint): boolean;
}