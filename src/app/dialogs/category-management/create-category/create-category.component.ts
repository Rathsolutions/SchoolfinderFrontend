import { Component, Inject, OnInit, Type } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AbstractCategoryManagement } from "../abstract-category-management";
import { SchoolCategoryManagementComponent } from "../school-category-management/school-category-management.component";

@Component({
  selector: "app-create-category",
  templateUrl: "./create-category.component.html",
  styleUrls: ["./create-category.component.css"],
})
export class CreateCategoryComponent
  extends AbstractCategoryManagement<CreateCategoryComponent, {}>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) data: CreateCategoryComponent
  ) {
    super(dialogRef, {});
  }
  ngOnInit(): void {}

  onCreateInsitutionCategoryClicked(): void {
    var type: Type<SchoolCategoryManagementComponent> =
      SchoolCategoryManagementComponent;
    this.dialogRef.close(type);
  }
  onCreatePersonCategoryClicked(): void {
    var type: Type<SchoolCategoryManagementComponent> =
      SchoolCategoryManagementComponent;
    this.dialogRef.close(type);
  }
}
