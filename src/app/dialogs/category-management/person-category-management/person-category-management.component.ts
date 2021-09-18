import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { FunctionalityEntity } from "src/app/entities/FunctionalityEntity";
import { FunctionalityService } from "src/app/services/functionality.service";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { AbstractCategoryManagement } from "../abstract-category-management";
import { CreateCategoryComponent } from "../create-category/create-category.component";

@Component({
  selector: "app-person-category-management",
  templateUrl: "./person-category-management.component.html",
  styleUrls: ["./person-category-management.component.css"],
})
export class PersonCategoryManagementComponent
  extends AbstractCategoryManagement<
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
    toastrService: ToastrService
  ) {
    super(dialogRef, data, calculationEventService, toastrService);
    this.persistStrategy.setServiceInstance(functionalityService);
  }

  ngOnInit(): void {}

  public saveChanges() {
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
