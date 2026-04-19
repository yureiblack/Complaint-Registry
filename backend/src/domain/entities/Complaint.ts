import { ComplaintStatus } from "../enums/ComplaintStatus";

export class Complaint {
  private status: ComplaintStatus;
  private isPublic: boolean;
  private isAnonymous: boolean;

  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public readonly userId: string,
    isPublic: boolean = false,
    isAnonymous: boolean = false,
    status: ComplaintStatus = ComplaintStatus.SUBMITTED
  ) {
    this.isPublic = isPublic;
    this.isAnonymous = isAnonymous;
    this.status = status;
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
      isAnonymous: this.isAnonymous,
    };
  }

  // -------------------------
  // SERIALIZATION
  // -------------------------

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      userId: this.userId,
      status: this.status,
      isPublic: this.isPublic,
      isAnonymous: this.isAnonymous,
    };
  }

  // -------------------------
  // BUSINESS RULES
  // -------------------------

  updateVisibility(isPublic: boolean, isAnonymous: boolean) {
    // Rule: private complaints cannot be anonymous
    if (!isPublic && isAnonymous) {
      throw new Error("Private complaints cannot be anonymous");
    }

    this.isPublic = isPublic;
    this.isAnonymous = isAnonymous;
  }

  transitionTo(next: ComplaintStatus) {
    const allowed: Record<ComplaintStatus, ComplaintStatus[]> = {
      [ComplaintStatus.SUBMITTED]: [ComplaintStatus.UNDER_REVIEW],
      [ComplaintStatus.UNDER_REVIEW]: [ComplaintStatus.IN_PROGRESS],
      [ComplaintStatus.IN_PROGRESS]: [
        ComplaintStatus.RESOLVED,
        ComplaintStatus.REJECTED,
      ],
      [ComplaintStatus.RESOLVED]: [ComplaintStatus.CLOSED],
      [ComplaintStatus.REJECTED]: [ComplaintStatus.CLOSED],
      [ComplaintStatus.CLOSED]: [],
    };

    if (!allowed[this.status].includes(next)) {
      throw new Error(
        `Invalid transition: ${this.status} → ${next}`
      );
    }

    this.status = next;
  }

  // -------------------------
  // FACTORY (FOR DB → DOMAIN)
  // -------------------------

  static fromPersistence(data: {
    id: string;
    title: string;
    description: string;
    userId: string;
    status: ComplaintStatus;
    isPublic: boolean;
    isAnonymous: boolean;
  }): Complaint {
    return new Complaint(
      data.id,
      data.title,
      data.description,
      data.userId,
      data.isPublic,
      data.isAnonymous,
      data.status
    );
  }
}