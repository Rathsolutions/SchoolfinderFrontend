import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BroadcastService } from "./BroadcastService";
@Injectable({
  providedIn: "root",
})
export class CalculationEventService implements BroadcastService<boolean> {
  private eventQueue = new Subject<boolean>();
  register(): Observable<boolean> {
    return this.eventQueue;
  }
  emit(eventMessage: boolean): void {
    this.eventQueue.next(eventMessage);
  }
}
