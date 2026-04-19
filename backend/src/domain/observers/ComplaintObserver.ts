export interface ComplaintObserver {
  update(event: string, data: any): void;
}