import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import { FunctionalityEntity } from "src/app/entities/FunctionalityEntity";
import { FunctionalityService } from "src/app/services/functionality.service";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { AbstractManagement } from "../abstract-management";

@Component({
  selector: "app-person-category-management",
  templateUrl: "./person-category-management.component.html",
  styleUrls: ["./person-category-management.component.css"],
})
export class PersonCategoryManagementComponent
  extends AbstractManagement<
    PersonCategoryManagementComponent,
    PersonCategoryManagementData
  >
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<PersonCategoryManagementComponent>,
    @Inject(MAT_DIALOG_DATA) data: PersonCategoryManagementData,
    calculationEventService: CalculationEventService,
    functionalityService: FunctionalityService,
    toastrService: ToastrService,
    mapEventService:MapUpdateEventService
  ) {
    super(dialogRef, data, calculationEventService, toastrService,mapEventService);
    this.persistStrategy.setServiceInstance(functionalityService);
  }

  ngOnInit(): void {}

  public async saveChanges() {
    var functionality = new FunctionalityEntity();
    functionality.id = this.data.id;
    functionality.name = this.data.name;
    super.saveChanges(functionality);
  }
}
export interface PersonCategoryManagementData {
  name: string;
  id: number;
  adminNotice: string;
  persistStrategy: PersistStrategy<FunctionalityEntity>;
}
