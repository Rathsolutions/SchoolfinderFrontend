import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { AreaEntity } from "src/app/entities/AreaEntity";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
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
import { SavableComponent } from "../SaveableComponent";
import { CreateStrategy } from "src/app/services/persistStrategy/CreateStrategy";
import { AreaManagementComponent } from "src/app/dialogs/area-management/area-management.component";

@Component({
  selector: "app-region-area-properties-menu",
  templateUrl: "./region-area-properties-menu.component.html",
  styleUrls: ["./region-area-properties-menu.component.css"],
})
export class RegionAreaPropertiesMenuComponent
  extends SavableComponent
  implements OnInit
{
  @ViewChild("picker") pickerInput: NgxMatColorPickerInput;

  public colorCtr: AbstractControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^#[0-9A-Fa-f]{6}$"),
  ]);

  public color: ThemePalette = "primary";
  public touchUi = false;

  public data: AreaManagementData = new AreaManagementData();

  constructor(
    calculationEventService: CalculationEventService,
    private areaService: AreaService,
    toastrService: ToastrService,
    private areaSelectionService: AreaSelectionService
  ) {
    super(
      calculationEventService,
      toastrService,
      new CreateStrategy<AreaEntity>()
    );
    this.persistStrategy.setServiceInstance(areaService);
  }

  ngOnInit(): void {
    this.colorCtr.setValue(this.data.color);
    this.colorCtr.valueChanges.subscribe((res) => (this.data.color = res));
  }
  setAreaInstitutionPosition() {
    this.areaSelectionService.emitAreaInstitutionEvent(this.data);
  }
  setArea() {
    this.areaSelectionService.emitAreaSelectionEvent(this.data);
  }
  saveChanges(): void {
    var area = new AreaEntity();
    area.id = this.data.id;
    area.name = this.data.name;
    area.color = this.data.color.toHex();
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

    this.calculationEventService.emit(true);
  }
}
export class AreaManagementData {
  name: string;
  id: number;
  areaInstitutionPosition: Coordinate;
  area: Coordinate[];
  color: Color;
  adminNotice: string;
  persistStrategy: PersistStrategy<AreaEntity>;
}
