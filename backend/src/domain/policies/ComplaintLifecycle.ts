import { ComplaintStatus } from "../enums/ComplaintStatus";

const allowedTransitions: Record<ComplaintStatus, ComplaintStatus[]> = {
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

export function canTransition(
  from: ComplaintStatus,
  to: ComplaintStatus
) {
  return allowedTransitions[from].includes(to);
}