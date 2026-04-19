"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintSubject = void 0;
class ComplaintSubject {
    constructor() {
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    notify(event, data) {
        // Fire notifications asynchronously without blocking
        Promise.allSettled(this.observers.map((observer) => {
            const result = observer.update(event, data);
            return Promise.resolve(result);
        })).catch(() => {
            // Silently catch errors to prevent blocking the main flow
        });
    }
}
exports.ComplaintSubject = ComplaintSubject;
