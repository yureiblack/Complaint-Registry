"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotifier = void 0;
class EmailNotifier {
    update(event, data) {
        console.log("📧 Email Sent:", event, data);
    }
}
exports.EmailNotifier = EmailNotifier;
