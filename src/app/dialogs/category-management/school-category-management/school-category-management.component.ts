import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AbstractCategoryManagement } from "../abstract-category-management";

@Component({
  selector: "app-school-category-management",
  templateUrl: "./school-category-management.component.html",
  styleUrls: ["./school-category-management.component.css"],
})
export class SchoolCategoryManagementComponent
  extends AbstractCategoryManagement<
    SchoolCategoryManagementComponent,
    SchoolCategoryManagementData
  >
  implements OnInit
{
  adminNotice: string = "";

  constructor(
    dialogRef: MatDialogRef<SchoolCategoryManagementComponent>,
    @Inject(MAT_DIALOG_DATA) data: SchoolCategoryManagementData
  ) {
    super(dialogRef,data);
    this.adminNotice = data.adminNotice;
  }

  ngOnInit(): void {}

  handleFileInput(files: FileList) {
    var file = files.item(0);
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      this.data.icon =
        "data:image/gif;base64," + btoa(reader.result.toString());
    };
  }
}
export interface SchoolCategoryManagementData {
  name: string;
  icon: string;
  id:number;
  adminNotice: string;
}
