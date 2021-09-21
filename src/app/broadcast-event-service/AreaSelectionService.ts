import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BroadcastService } from "./BroadcastService";
import { AreaManagementData } from "../dialogs/area-management/area-management.component";
@Injectable({
  providedIn: "root",
})
export class AreaSelectionService
  implements BroadcastService<AreaManagementData>
{
  private eventQueueSelectionEvent = new Subject<AreaManagementData>();
  private eventQueueInsitutionEvent = new Subject<AreaManagementData>();
  private activeEventQueue: Subject<AreaManagementData>;
  register(): Observable<AreaManagementData> {
    return this.activeEventQueue;
  }
  registerSelectionEvent(): Observable<AreaManagementData> {
    return this.eventQueueSelectionEvent;
  }
  registerInstitutionEvent(): Observable<AreaManagementData> {
    return this.eventQueueInsitutionEvent;
  }
  emit(eventMessage: AreaManagementData): void {
    this.activeEventQueue.next(eventMessage);
  }
  emitAreaInstitutionEvent(eventMessage: AreaManagementData) {
    this.activeEventQueue = this.eventQueueInsitutionEvent;
    this.emit(eventMessage);
  }
  emitAreaSelectionEvent(eventMessage: AreaManagementData) {
    this.activeEventQueue = this.eventQueueSelectionEvent;
    this.emit(eventMessage);
  }
}
