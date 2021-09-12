import { Component, Inject, OnInit, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { AbstractCategoryManagement } from "../abstract-category-management";
import { PersonCategoryManagementComponent } from "../person-category-management/person-category-management.component";
import { SchoolCategoryManagementComponent } from "../school-category-management/school-category-management.component";

@Component({
  selector: "app-create-category",
  templateUrl: "./create-category.component.html",
  styleUrls: ["./create-category.component.css"],
})
export class CreateCategoryComponent
  extends AbstractCategoryManagement<
    CreateCategoryComponent,
    { persistStrategy: null }
  >
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    calculationEventService: CalculationEventService,
    projectService: ProjectCategoryService,
    toastrService: ToastrService
  ) {
    super(dialogRef, data, calculationEventService, toastrService);
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
}
