import { ComplaintObserver } from "./ComplaintObserver";

export class ComplaintSubject {
  private observers: ComplaintObserver[] = [];

  subscribe(observer: ComplaintObserver) {
    this.observers.push(observer);
  }

  notify(event: string, data: any) {
    for (const observer of this.observers) {
      observer.update(event, data);
    }
  }
}