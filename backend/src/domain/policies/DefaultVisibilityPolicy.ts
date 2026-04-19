import { VisibilityPolicy } from "./VisibilityPolicy";
import { User } from "../entities/User";
import { Complaint } from "../entities/Complaint";

export class DefaultVisibilityPolicy implements VisibilityPolicy {
  canView(user: User, complaint: Complaint): boolean {
    const visibility = complaint.getVisibility();

    if (user.isAdmin()) return true;

    if (visibility.isPublic) return true;

    if (complaint.userId === user.id) return true;

    return false;
  }
}