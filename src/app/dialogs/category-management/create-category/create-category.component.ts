import { Component, Inject, OnInit, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import { FunctionalityService } from "src/app/services/functionality.service";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { AbstractManagement } from "../abstract-management";
import { AdditionalCategoryManagementComponentComponent } from "../additional-category-management-component/additional-category-management-component.component";
import { PersonCategoryManagementComponent } from "../person-category-management/person-category-management.component";
import { SchoolCategoryManagementComponent } from "../school-category-management/school-category-management.component";

@Component({
  selector: "app-create-category",
  templateUrl: "./create-category.component.html",
  styleUrls: ["./create-category.component.css"],
})
export class CreateCategoryComponent
  extends AbstractManagement<CreateCategoryComponent, { persistStrategy: null }>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    calculationEventService: CalculationEventService,
    toastrService: ToastrService,
    mapEventService: MapUpdateEventService
  ) {
    super(
      dialogRef,
      data,
      calculationEventService,
      toastrService,
      mapEventService
    );
  }
  ngOnInit(): void {}

  onCreateInsitutionCategoryClicked(): void {
    var type: Type<SchoolCategoryManagementComponent> =
      SchoolCategoryManagementComponent;
    this.dialogRef.close(type);
  }
  onCreatePersonCategoryClicked(): void {
    var type: Type<PersonCategoryManagementComponent> =
      PersonCategoryManagementComponent;
    this.dialogRef.close(type);
  }

  onCreateAdditionalCategoryClicked(): void {
    var type: Type<AdditionalCategoryManagementComponentComponent> =
      AdditionalCategoryManagementComponentComponent;
    this.dialogRef.close(type);
  }
}
