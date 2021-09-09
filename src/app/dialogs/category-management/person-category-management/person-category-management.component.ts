import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AbstractCategoryManagement } from "../abstract-category-management";
import { CreateCategoryComponent } from "../create-category/create-category.component";

@Component({
  selector: "app-person-category-management",
  templateUrl: "./person-category-management.component.html",
  styleUrls: ["./person-category-management.component.css"],
})
export class PersonCategoryManagementComponent
  extends AbstractCategoryManagement<PersonCategoryManagementComponent, {}>
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<PersonCategoryManagementComponent>,
    @Inject(MAT_DIALOG_DATA) data: CreateCategoryComponent
  ) {
    super(dialogRef, {});
  }

  ngOnInit(): void {}
}
