import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BroadcastService } from "./BroadcastService";
@Injectable({
  providedIn: "root",
})
export class MapUpdateEventService implements BroadcastService<Boolean> {
  private eventQueue = new Subject<Boolean>();
  register(): Observable<Boolean> {
    return this.eventQueue;
  }
  emit(eventMessage: Boolean): void {
    this.eventQueue.next(eventMessage);
  }
}
