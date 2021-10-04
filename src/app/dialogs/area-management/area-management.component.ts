import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { AreaEntity } from "src/app/entities/AreaEntity";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
import { AbstractManagement } from "../category-management/abstract-management";
import { AreaSelectionService } from "../../broadcast-event-service/AreaSelectionService";
import { Coordinate } from "ol/coordinate";
import { AbstractControl, FormControl, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import {
  Color,
  NgxMatColorPickerInput,
} from "@angular-material-components/color-picker";
import { Position } from "src/app/entities/Position";
import { AreaService } from "src/app/services/area.service";
import { Observable } from "rxjs";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";

@Component({
  selector: "app-area-management",
  templateUrl: "./area-management.component.html",
  styleUrls: ["./area-management.component.css"],
})
export class AreaManagementComponent
  extends AbstractManagement<AreaManagementComponent, AreaManagementData>
  implements OnInit
{
  @ViewChild("picker") pickerInput: NgxMatColorPickerInput;

  public colorCtr: AbstractControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^#[0-9A-Fa-f]{6}$"),
  ]);

  public color: ThemePalette = "primary";
  public touchUi = false;

  constructor(
    dialogRef: MatDialogRef<AreaManagementComponent>,
    @Inject(MAT_DIALOG_DATA) data: AreaManagementData,
    calculationEventService: CalculationEventService,
    private areaService: AreaService,
    toastrService: ToastrService,
    private areaSelectionService: AreaSelectionService,
    mapEventService: MapUpdateEventService
  ) {
    super(
      dialogRef,
      data,
      calculationEventService,
      toastrService,
      mapEventService
    );
    console.log(data);
    this.persistStrategy.setServiceInstance(areaService);
  }

  ngOnInit(): void {
    console.log(this.data.color);
    this.colorCtr.setValue(this.data.color);
    this.colorCtr.valueChanges.subscribe((res) => (this.data.color = res));
  }
  setAreaInstitutionPosition() {
    this.toastrService.info("Bitte wählen Sie den Standort der Regionalstelle");
    this.areaSelectionService.emitAreaInstitutionEvent(this.data);
    this.dialogRef.close();
  }
  setArea() {
    this.toastrService.info("Bitte kreisen Sie das Regionalstellengebiet ein");
    this.areaSelectionService.emitAreaSelectionEvent(this.data);
    this.dialogRef.close();
  }
  async saveChanges() {
    var area = new AreaEntity();
    area.id = this.data.id;
    area.name = this.data.name;
    area.color = this.data.color.toRgba();
    var areaInstitutionPosition = new Position();
    areaInstitutionPosition.latitude = this.data.areaInstitutionPosition[0];
    areaInstitutionPosition.longitude = this.data.areaInstitutionPosition[1];
    var areaPolygon: Position[] = [];
    area.areaInstitutionPosition = areaInstitutionPosition;
    this.data.area.forEach((e) => {
      var polygonEdgePoint = new Position();
      polygonEdgePoint.latitude = e[0];
      polygonEdgePoint.longitude = e[1];
      areaPolygon.push(polygonEdgePoint);
    });
    area.areaPolygon = areaPolygon;
    super.saveChanges(area).then((res) => {
      this.toastrService.success(
        "Der Regionalstellenbezirk " +
          area.name +
          " wurde erfolgreich editiert!"
      );
    });
  }
}
export interface AreaManagementData {
  name: string;
  id: number;
  areaInstitutionPosition: Coordinate;
  area: Coordinate[];
  color: Color;
  persistStrategy: PersistStrategy<AreaEntity>;
}
