import { Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export abstract class AbstractCategoryManagement<
  ManagementComponent,
  ComponentData
> {
  constructor(
    public dialogRef: MatDialogRef<ManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComponentData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
