import { ComplaintObserver } from "../../domain/observers/ComplaintObserver";

export class EmailNotifier implements ComplaintObserver {
  update(event: string, data: any): void {
    console.log("📧 Email Sent:", event, data);
  }
}