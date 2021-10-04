import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BroadcastService } from "./BroadcastService";
import { VisibilityEventStrategy } from "./visibility-event-strategies/VisibilityEventStrategy";
@Injectable({
  providedIn: "root",
})
export class VisibilityEventService implements BroadcastService<VisibilityEventStrategy> {
  private eventQueue = new Subject<VisibilityEventStrategy>();
  register(): Observable<VisibilityEventStrategy> {
    return this.eventQueue;
  }
  emit(eventMessage: VisibilityEventStrategy): void {
    this.eventQueue.next(eventMessage);
  }
}