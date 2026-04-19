import { ComplaintObserver } from "./ComplaintObserver";

export class ComplaintSubject {
  private observers: ComplaintObserver[] = [];

  subscribe(observer: ComplaintObserver) {
    this.observers.push(observer);
  }

  notify(event: string, data: any) {
    // Fire notifications asynchronously without blocking
    Promise.allSettled(
      this.observers.map((observer) => {
        const result = observer.update(event, data);
        return Promise.resolve(result);
      })
    ).catch(() => {
      // Silently catch errors to prevent blocking the main flow
    });
  }
}