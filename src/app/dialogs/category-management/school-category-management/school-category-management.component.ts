import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { ProjectCategoryEntity } from "src/app/entities/ProjectEntity";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
import { ProjectCategoryService } from "src/app/services/project-category.service";
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
  @ViewChild("uploadFileInput") uploadFileInput: ElementRef<HTMLButtonElement>;

  adminNotice: string = "";

  constructor(
    dialogRef: MatDialogRef<SchoolCategoryManagementComponent>,
    @Inject(MAT_DIALOG_DATA) data: SchoolCategoryManagementData,
    private calculationEventService: CalculationEventService,
    private projectService: ProjectCategoryService,
    private toastrService: ToastrService
  ) {
    super(dialogRef, data);
    this.adminNotice = data.adminNotice;
  }

  ngOnInit(): void {}

  saveChanges(): void {
    var projectCategoryEntity = new ProjectCategoryEntity();
    projectCategoryEntity.id = this.data.id;
    projectCategoryEntity.name = this.data.name;
    projectCategoryEntity.icon = this.data.icon;
    this.calculationEventService.emit(true);
    this.data.persistStrategy.persist(projectCategoryEntity).subscribe(
      (res) => {
        this.calculationEventService.emit(false);
        this.dialogRef.close(res);
      },
      (rej) => {
        this.calculationEventService.emit(false);
        this.toastrService.error(
          "Bei der Erstellung ist ein Fehler aufgetreten! Bitte überprüfen Sie alle eingetragenen Werte"
        );
      }
    );
  }

  uploadFileButtonClicked(): void {
    this.uploadFileInput.nativeElement.click();
  }

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
  id: number;
  adminNotice: string;
  persistStrategy: PersistStrategy<ProjectCategoryEntity>;
}