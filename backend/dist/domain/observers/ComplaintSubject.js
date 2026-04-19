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
        for (const observer of this.observers) {
            observer.update(event, data);
        }
    }
}
exports.ComplaintSubject = ComplaintSubject;
