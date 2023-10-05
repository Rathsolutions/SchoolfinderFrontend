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
import GeoJSON from "ol/format/GeoJSON";
import { transform } from "ol/proj";
import { CriteriaListEntriesChangedService } from "src/app/broadcast-event-service/CriteriaListEntriesChangedService";
import { Polygon } from "ol/geom";

@Component({
  selector: "app-area-management",
  templateUrl: "./area-management.component.html",
  styleUrls: ["./area-management.component.css"],
})
export class AreaManagementComponent
  extends AbstractManagement<AreaManagementComponent, AreaManagementData>
  implements OnInit {
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
    private criteriaListEntriesChangedService: CriteriaListEntriesChangedService,
    mapEventService: MapUpdateEventService
  ) {
    super(
      dialogRef,
      data,
      calculationEventService,
      toastrService,
      mapEventService
    );
    this.dialogRef.disableClose = true;
    this.persistStrategy.setServiceInstance(areaService);
  }

  ngOnInit(): void {
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

  handleFileInput(files: FileList) {
    var file = files.item(0);
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      var feature = new GeoJSON().readFeature(reader.result.toString());
      this.data.area = [];
      (feature
        .getGeometry() as Polygon)
        .getCoordinates().forEach(co => {
          co.forEach((element) => {
            transform(element, "EPSG:4326", "EPSG:3857");
            this.data.area.push(element);
          });
        })
    };
  }

  public onNoClick() {
    this.data.callbackFunction();
    super.onNoClick();
  }

  public deleteCurrent() {
    if (this.data.id) {
      this.areaService.delete(this.data.id).subscribe(
        (res) => {
          this.toastrService.success(
            "Der Regionalstellenbezirk wurde erfolgreich gelöscht!"
          );
          this.mapEventService.emit(true);
          this.criteriaListEntriesChangedService.emit();
          this.dialogRef.close();
        },
        (rej) => {
          this.toastrService.error(
            "Beim Löschen des Regionalstellenbezirks ist ein Fehler aufgetreten!"
          );
        }
      );
    }
  }

  async saveChanges() {
    var area = new AreaEntity();
    if (
      !this.data.name ||
      !this.data.color ||
      !this.data.areaInstitutionPosition ||
      !this.data.area
    ) {
      this.toastrService.error("Bitte füllen Sie alle Felder korrekt aus!");
      return;
    }
    if (this.data.area.length < 4) {
      this.toastrService.error(
        "Das Bezirksgebiet muss aus mindestens 3 Punkten bestehen!"
      );
      return;
    }
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
      this.criteriaListEntriesChangedService.emit();
    });
    this.data.callbackFunction();
  }
}
export interface AreaManagementData {
  name: string;
  id: number;
  areaInstitutionPosition: Coordinate;
  area: Coordinate[];
  color: Color;
  persistStrategy: PersistStrategy<AreaEntity>;
  callbackFunction: () => void;
}
