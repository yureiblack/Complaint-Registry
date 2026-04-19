"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultVisibilityPolicy = void 0;
class DefaultVisibilityPolicy {
    canView(user, complaint) {
        const visibility = complaint.getVisibility();
        if (user.isAdmin())
            return true;
        if (visibility.isPublic)
            return true;
        if (complaint.userId === user.id)
            return true;
        return false;
    }
}
exports.DefaultVisibilityPolicy = DefaultVisibilityPolicy;
