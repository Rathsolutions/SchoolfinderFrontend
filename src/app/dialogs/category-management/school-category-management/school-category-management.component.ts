import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import { ProjectCategoryEntity } from "src/app/entities/ProjectEntity";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { AbstractManagement } from "../abstract-management";

@Component({
  selector: "app-school-category-management",
  templateUrl: "./school-category-management.component.html",
  styleUrls: ["./school-category-management.component.css"],
})
export class SchoolCategoryManagementComponent
  extends AbstractManagement<
    SchoolCategoryManagementComponent,
    SchoolCategoryManagementData
  >
  implements OnInit, AfterViewInit
{
  @ViewChild("uploadFileInput") uploadFileInput: ElementRef<HTMLButtonElement>;
  @ViewChild("imgContainer") imgContainer: ElementRef<HTMLDivElement>;

  adminNotice: string = "";
  isSvg: boolean = false;
  constructor(
    dialogRef: MatDialogRef<SchoolCategoryManagementComponent>,
    @Inject(MAT_DIALOG_DATA) data: SchoolCategoryManagementData,
    calculationEventService: CalculationEventService,
    projectService: ProjectCategoryService,
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
    this.adminNotice = data.adminNotice;
    this.persistStrategy.setServiceInstance(projectService);
  }
  ngAfterViewInit(): void {
    if (this.data.icon.startsWith("data:image/svg+xml")) {
      this.isSvg = true;
      this.renderSvg(atob(this.data.icon.substring(26)));
    }
  }

  ngOnInit(): void {}

  async saveChanges() {
    var projectCategoryEntity = new ProjectCategoryEntity();
    projectCategoryEntity.id = this.data.id;
    projectCategoryEntity.name = this.data.name;
    projectCategoryEntity.icon = this.data.icon;
    projectCategoryEntity.scaling = this.data.scaling;
    super.saveChanges(projectCategoryEntity);
  }

  uploadFileButtonClicked(): void {
    this.uploadFileInput.nativeElement.click();
  }

  handleFileInput(files: FileList) {
    var file = files.item(0);
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      this.imgContainer.nativeElement.innerHTML = "";
      if (file.type == "image/svg+xml") {
        this.isSvg = true;
        this.renderSvg(reader.result.toString());
      } else {
        this.isSvg = false;
      }
      this.data.icon =
        "data:" + file.type + ";base64," + btoa(reader.result.toString());
    };
  }

  private renderSvg(svg: string) {
    this.imgContainer.nativeElement.innerHTML = svg;
  }
}
export interface SchoolCategoryManagementData {
  name: string;
  icon: string;
  id: number;
  scaling: number;
  adminNotice: string;
  persistStrategy: PersistStrategy<ProjectCategoryEntity>;
}
