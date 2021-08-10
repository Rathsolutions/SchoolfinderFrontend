import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CriteriaEntity } from "../entities/CriteriaEntity";
import { BroadcastService } from "./BroadcastService";
@Injectable({
  providedIn: "root",
})
export class CriteriaSelectionEventService
  implements BroadcastService<CriteriaEntity[]>
{
  private eventQueue = new Subject<CriteriaEntity[]>();
  register(): Observable<CriteriaEntity[]> {
    return this.eventQueue;
  }
  emit(eventMessage: CriteriaEntity[]): void {
    this.eventQueue.next(eventMessage);
  }
}
