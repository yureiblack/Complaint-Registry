import { ComplaintStatus } from "../enums/ComplaintStatus";

export class Complaint {
  private status: ComplaintStatus;

  constructor(
    public readonly id: string,   // ✔ comes from Prisma
    public title: string,
    public description: string,
    public readonly userId: string,
    private isPublic: boolean = false,
    private isAnonymous: boolean = false
  ) {
    this.status = ComplaintStatus.SUBMITTED;
  }

  // -------------------------
  // GETTERS (Encapsulation)
  // -------------------------

  getStatus(): ComplaintStatus {
    return this.status;
  }

  getVisibility() {
    return {
      isPublic: this.isPublic,
      isAnonymous: this.isAnonymous
    };
  }

  // -------------------------
  // BUSINESS RULES
  // -------------------------

  updateVisibility(isPublic: boolean, isAnonymous: boolean) {
    this.isPublic = isPublic;
    this.isAnonymous = isAnonymous;
  }

  transitionTo(next: ComplaintStatus) {
    const allowed: Record<ComplaintStatus, ComplaintStatus[]> = {
      [ComplaintStatus.SUBMITTED]: [ComplaintStatus.UNDER_REVIEW],
      [ComplaintStatus.UNDER_REVIEW]: [ComplaintStatus.IN_PROGRESS],
      [ComplaintStatus.IN_PROGRESS]: [
        ComplaintStatus.RESOLVED,
        ComplaintStatus.REJECTED
      ],
      [ComplaintStatus.RESOLVED]: [ComplaintStatus.CLOSED],
      [ComplaintStatus.REJECTED]: [ComplaintStatus.CLOSED],
      [ComplaintStatus.CLOSED]: []
    };

    if (!allowed[this.status].includes(next)) {
      throw new Error(
        `Invalid transition: ${this.status} → ${next}`
      );
    }

    this.status = next;
  }
}