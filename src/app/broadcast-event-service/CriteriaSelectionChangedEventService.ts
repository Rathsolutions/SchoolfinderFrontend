import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CriteriaEntity } from "../entities/CriteriaEntity";
import { BroadcastService } from "./BroadcastService";
import { SchoolTypeDTO } from "../entities/SchoolTypeDTO";
import { ProjectCategoryEntity } from "../entities/ProjectEntity";
@Injectable({
  providedIn: "root",
})
export class CriteriaSelectionEventService
  implements BroadcastService<CriteriaSelectionEventData>
{
  private eventQueue = new Subject<CriteriaSelectionEventData>();
  register(): Observable<CriteriaSelectionEventData> {
    return this.eventQueue;
  }
  emit(eventMessage: CriteriaSelectionEventData): void {
    this.eventQueue.next(eventMessage);
  }
}


export interface CriteriaSelectionEventData{
  criterias:CriteriaEntity[];
  schoolTypes:SchoolTypeDTO[];
  projectCategories:ProjectCategoryEntity[];
  exclusive:boolean;
}