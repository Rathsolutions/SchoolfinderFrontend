import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CriteriaEntity } from "../entities/CriteriaEntity";
import { BroadcastService } from "./BroadcastService";
@Injectable({
  providedIn: "root",
})
export class CriteriaListEntriesChangedService
  implements BroadcastService<void>
{
  private eventQueue = new Subject<void>();
  register(): Observable<void> {
    return this.eventQueue;
  }
  emit(eventMessage: void): void {
    this.eventQueue.next(eventMessage);
  }
}
