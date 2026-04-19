"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canTransition = canTransition;
const ComplaintStatus_1 = require("../enums/ComplaintStatus");
const allowedTransitions = {
    [ComplaintStatus_1.ComplaintStatus.SUBMITTED]: [ComplaintStatus_1.ComplaintStatus.UNDER_REVIEW],
    [ComplaintStatus_1.ComplaintStatus.UNDER_REVIEW]: [ComplaintStatus_1.ComplaintStatus.IN_PROGRESS],
    [ComplaintStatus_1.ComplaintStatus.IN_PROGRESS]: [
        ComplaintStatus_1.ComplaintStatus.RESOLVED,
        ComplaintStatus_1.ComplaintStatus.REJECTED,
    ],
    [ComplaintStatus_1.ComplaintStatus.RESOLVED]: [ComplaintStatus_1.ComplaintStatus.CLOSED],
    [ComplaintStatus_1.ComplaintStatus.REJECTED]: [ComplaintStatus_1.ComplaintStatus.CLOSED],
    [ComplaintStatus_1.ComplaintStatus.CLOSED]: [],
};
function canTransition(from, to) {
    return allowedTransitions[from].includes(to);
}
