import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BroadcastService } from "./BroadcastService";
import {AreaManagementData} from "../dialogs/area-management/area-management.component";
@Injectable({
  providedIn: "root",
})
export class AreaSelectionService implements BroadcastService<AreaManagementData> {
  private eventQueue = new Subject<AreaManagementData>();
  register(): Observable<AreaManagementData> {
    return this.eventQueue;
  }
  emit(eventMessage: AreaManagementData): void {
    this.eventQueue.next(eventMessage);
  }
}
