import { ComplaintObserver } from "../../domain/observers/ComplaintObserver";

export class InAppNotifier implements ComplaintObserver {
  update(event: string, data: any): void {
    console.log("🔔 In-App Notification:", event, data);
  }
}