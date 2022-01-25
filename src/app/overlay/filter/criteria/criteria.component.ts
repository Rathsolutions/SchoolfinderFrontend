//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import {
  Component,
  Type,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { CriteriaService } from "../../../services/criteria.service";
import { CriteriaEntity } from "src/app/entities/CriteriaEntity";
import { MainComponent } from "src/app/overlay/main/main.component";
import { SchoolsService } from "../../../services/schools.service";
import { BaseService } from "src/app/services/base.service";
import { UserService } from "src/app/services/user.service";
import { SearchService } from "src/app/services/search.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { SearchSelectionComponent } from "../../..//dialogs/searchSelection.component";
import { OsmPOIEntity } from "../../../entities/OsmPOIEntity";
import { SelectionDialogViewData } from "src/app/viewdata/SelectionDialogViewData";
import { CriteriaSelectionEventService } from "src/app/broadcast-event-service/CriteriaSelectionChangedEventService";
import {
  ZoomEventMessage,
  ZoomToEventService,
} from "src/app/broadcast-event-service/ZoomToEventService";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import { SchoolCategoryManagementComponent } from "src/app/dialogs/category-management/school-category-management/school-category-management.component";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { CreateCategoryComponent } from "src/app/dialogs/category-management/create-category/create-category.component";
import { AbstractManagement } from "src/app/dialogs/category-management/abstract-management";
import { EditStrategy } from "src/app/services/persistStrategy/EditStrategy";
import { ProjectCategoryEntity } from "src/app/entities/ProjectEntity";
import { CreateStrategy } from "src/app/services/persistStrategy/CreateStrategy";
import { FunctionalityService } from "src/app/services/functionality.service";
import { PersonCategoryManagementComponent } from "src/app/dialogs/category-management/person-category-management/person-category-management.component";
import { FunctionalityEntity } from "src/app/entities/FunctionalityEntity";
import { DummyStrategy } from "src/app/services/persistStrategy/DummyStrategy";
import { AreaEntity } from "src/app/entities/AreaEntity";
import { AreaService } from "src/app/services/area.service";
import { AreaManagementComponent } from "src/app/dialogs/area-management/area-management.component";
import { Coordinate } from "ol/coordinate";
import { Color } from "@angular-material-components/color-picker";
import { ColorParser } from "src/app/util/color-parser";
import { AbstractCategoryEntity } from "src/app/entities/AbstractCategoryEntity";
import { VisibilityEventService } from "src/app/broadcast-event-service/VisibilityEventService";
import { VisibilityEventStrategy } from "src/app/broadcast-event-service/visibility-event-strategies/VisibilityEventStrategy";
import { AreaShowEventStrategy } from "src/app/broadcast-event-service/visibility-event-strategies/AreaShowEventStrategy";
import { AreaHideEventStrategy } from "src/app/broadcast-event-service/visibility-event-strategies/AreaHideEventStrategy";
import { CriteriaListEntriesChangedService } from "src/app/broadcast-event-service/CriteriaListEntriesChangedService";
import { InformationType } from "src/app/entities/InformationType";
import { InformationTypeService } from "src/app/services/information-type.service";
import { AddAdditionalInformation } from "src/app/viewdata/additional-information/add/add-additional-information.component";
import { AdditionalCategoryManagementComponentComponent as AdditionalCategoryTypeManagementComponentComponent } from "src/app/dialogs/category-management/additional-category-management-component/additional-category-management-component.component";
import { SchoolTypeService } from "src/app/services/school-type.service";
import { SchoolTypeDTO } from "src/app/entities/SchoolTypeDTO";

@Component({
  selector: "criteria-filter-component",
  templateUrl: "./criteria.component.html",
  styleUrls: ["./criteria.component.css"],
})
export class CriteriaFilterComponent implements OnInit {
  @ViewChild("areaSelectionField")
  areaSelectionField: MatSelect;
  @ViewChild("categorySelectionField")
  categorySelectionField: MatSelect;

  allCriterias: CriteriaEntity[] = [];
  allAreas: AreaEntity[];
  allAdditionalInformationTypes: InformationType[];
  allPersonCategories: FunctionalityEntity[] = [];
  allInstitutionCategories: ProjectCategoryEntity[] = [];
  selectedCriterias: CriteriaEntity[] = [];
  selectedSchoolTypes: SchoolTypeDTO[] = [];
  schoolname: string;
  streetname: string;
  housenumber: string;
  city: string = "";
  institutionQueryParam: string = "";
  amount: number;
  exclusiveSearch: boolean = false;
  categoryName: string = "";
  step: number = 0;
  showRegionAreas: boolean = true;

  @Input()
  private projectParamId: number;
  @Output() disableButtonsEvent = new EventEmitter<boolean>();
  disabled: boolean = false;

  allSchoolTypesForColorLegend: SchoolTypeDTO[] = [];
  allSchoolTypesForFiltering: SchoolTypeDTO[] = [];

  constructor(
    private criteriaService: CriteriaService,
    private toastr: ToastrService,
    private criteriaSelectionEventService: CriteriaSelectionEventService,
    private zoomEventService: ZoomToEventService,
    private mapUpdateEventService: MapUpdateEventService,
    private calculationEventService: CalculationEventService,
    private schoolService: SchoolsService,
    private citiesService: SearchService,
    private projectCategoryService: ProjectCategoryService,
    private functionalityService: FunctionalityService,
    private informationTypeService: InformationTypeService,
    private areaService: AreaService,
    private dialog: MatDialog,
    private visibilityEventService: VisibilityEventService,
    private criteriaListEntriesChangedService: CriteriaListEntriesChangedService,
    private schoolTypeService: SchoolTypeService
  ) { }
  ngOnInit(): void {
    this.updateAllCriteriasList();
    this.updateAllAreasList();
    this.updateAllCategoriesList();
    this.criteriaListEntriesChangedService.register().subscribe(() => {
      this.setButtonsDisabled(false);
      this.updateAllCriteriasList();
      this.updateAllAreasList();
      this.updateAllCategoriesList();
    });
    this.updateColorLegend(this.allSchoolTypesForColorLegend);
    this.updateColorLegend(this.allSchoolTypesForFiltering);
    this.mapUpdateEventService.register().subscribe(() => {
      this.updateColorLegend(this.allSchoolTypesForColorLegend);
    });
  }

  private updateColorLegend(arrayToUpdate: SchoolTypeDTO[]) {
    if (this.projectParamId) {
      this.schoolTypeService
        .findSchoolTypesInProject(this.projectParamId)
        .subscribe((res) => {
          arrayToUpdate.splice(0, arrayToUpdate.length);
          res.forEach(e => {
            arrayToUpdate.push(e);
          });
        });
    } else {
      this.schoolTypeService
        .findSchoolTypesUsedAtLeastOnce()
        .subscribe((res) => {
          arrayToUpdate.splice(0, arrayToUpdate.length);
          res.forEach(e => {
            arrayToUpdate.push(e);
          });
        });
    }
  }

  private setButtonsDisabled(val: boolean) {
    this.disabled = val;
    this.disableButtonsEvent.emit(val);
  }

  toRGBString(schoolType: SchoolTypeDTO) {
    return (
      "rgb(" + schoolType.r + "," + schoolType.g + "," + schoolType.b + ")"
    );
  }

  private updateAllCriteriasList() {
    this.allCriterias = [];
    this.criteriaService.getAllCriterias().subscribe((result) => {
      result.forEach((e) => this.allCriterias.push(e));
    });
  }

  private updateAllAreasList() {
    if (this.areaSelectionField) {
      this.areaSelectionField.writeValue(null);
    }
    this.allAreas = [];
    this.areaService.findAll().subscribe((res) => {
      this.allAreas = res;
    });
  }

  private updateAllCategoriesList() {
    this.allPersonCategories = [];
    this.allInstitutionCategories = [];
    this.allAdditionalInformationTypes = [];
    this.functionalityService.findAll().subscribe((res) => {
      res.forEach((e) => this.allPersonCategories.push(e));
    });
    this.projectCategoryService.findAll().subscribe((res) => {
      res.forEach((e) => this.allInstitutionCategories.push(e));
    });
    this.informationTypeService.findAll().subscribe((result) => {
      result.forEach((e) => this.allAdditionalInformationTypes.push(e));
    });
  }

  setStep(step: number): void {
    this.step = step;
  }

  public createArea() {
    this.dialog.open(AreaManagementComponent, {
      data: {
        adminNotice: "Unbekannt",
        persistStrategy: new CreateStrategy<AreaEntity>(),
        callbackFunction: () => {
          this.setButtonsDisabled(false);
        },
      },
    });
    this.setButtonsDisabled(true);
  }

  public areaSelectionTriggered(evt: any) {
    this.areaService.findByName(evt.value.name).subscribe((res) => {
      var institutionPositionCoordinates: Coordinate = [
        res.areaInstitutionPosition.latitude,
        res.areaInstitutionPosition.longitude,
      ];
      var areaCoordinates: Coordinate[] = [];
      res.areaPolygon.forEach((e) => {
        areaCoordinates.push([e.latitude, e.longitude]);
      });
      var color: Color = ColorParser.parseRgbaString(res.color);
      this.dialog
        .open(AreaManagementComponent, {
          data: {
            name: res.name,
            color: color,
            id: res.id,
            areaInstitutionPosition: institutionPositionCoordinates,
            area: areaCoordinates,
            persistStrategy: new EditStrategy<AreaEntity>(),
            callbackFunction: () => {
              this.setButtonsDisabled(false);
            },
          },
        })
        .afterClosed()
        .subscribe((res) => {
          this.updateAllAreasList();
        });
      this.setButtonsDisabled(true);
    });
  }

  public personCategorySelectionTriggered(entity: ProjectCategoryEntity) {
    this.functionalityService.findByName(entity.name).subscribe(
      (res) => {
        var openedDialog = this.dialog.open(PersonCategoryManagementComponent, {
          data: {
            adminNotice:
              "In dieser Ansicht haben Sie die Möglichkeit, die Personenkategorie " +
              res.name +
              " zu bearbeiten.",
            name: res.name,
            id: res.id,
            persistStrategy: new EditStrategy<FunctionalityEntity>(),
          },
        });
        openedDialog
          .afterClosed()
          .subscribe(this.handleCategoryDialogClose.bind(this));
      },
      (rejTwo) => {
        this.throwErrorMessage();
      }
    );
  }

  additionalInformationTypesSelectionTriggered(entity: InformationType) {
    this.informationTypeService.findByValue(entity.name).subscribe(
      (res) => {
        var openedDialog = this.dialog.open(
          AdditionalCategoryTypeManagementComponentComponent,
          {
            data: {
              adminNotice:
                "In dieser Ansicht haben Sie die Möglichkeit, die Zusatzkategorie " +
                res.name +
                " zu bearbeiten.",
              name: res.name,
              id: res.id,
              persistStrategy: new EditStrategy<InformationType>(),
            },
          }
        );
        openedDialog
          .afterClosed()
          .subscribe(this.handleCategoryDialogClose.bind(this));
      },
      (rejTwo) => {
        this.throwErrorMessage();
      }
    );
  }

  public institutionCategorySelectionTriggered(entity: ProjectCategoryEntity) {
    this.projectCategoryService.findProjectByName(entity.name).subscribe(
      (res) => {
        var openedDialog = this.dialog.open(SchoolCategoryManagementComponent, {
          data: {
            adminNotice:
              "In dieser Ansicht haben Sie die Möglichkeit, die Institutionskategorie " +
              res.name +
              " zu bearbeiten.",
            name: res.name,
            icon: res.icon,
            scaling: res.scaling,
            id: res.id,
            persistStrategy: new EditStrategy<ProjectCategoryEntity>(),
          },
        });
        openedDialog
          .afterClosed()
          .subscribe(this.handleCategoryDialogClose.bind(this));
      },
      (rej) => {
        this.throwErrorMessage();
      }
    );
  }

  private handleCategoryDialogClose(res) {
    if (res) {
      this.handleClosedCategoryDialog(
        "Die Kategorie " + res.name + " wurde erfolgreich editiert!"
      );
    }
    this.categorySelectionField.writeValue(null);
    this.updateAllCategoriesList();
  }

  public createCategory(): void {
    var dialog = this.dialog.open(CreateCategoryComponent, {
      data: { persistStrategy: new DummyStrategy() },
    });
    dialog
      .afterClosed()
      .subscribe((res: Type<AbstractManagement<any, any>>) => {
        if (!res) {
          return;
        }
        var openedDialog = this.dialog.open(res, {
          data: {
            adminNotice:
              "In dieser Ansicht haben Sie die Möglichkeit, die Kategorie " +
              this.categoryName +
              " zu erstellen.",
            name: this.categoryName,
            persistStrategy: new CreateStrategy<any>(),
          },
        });
        openedDialog
          .afterClosed()
          .subscribe(this.handleCategoryDialogClose.bind(this));
      });
  }

  private throwErrorMessage() {
    this.toastr.error(
      "Es ist ein Fehler aufgetreten! Bitte kontaktieren Sie den Systemadministrator."
    );
  }

  private handleClosedCategoryDialog(toastrMessage: string) {
    this.toastr.success(toastrMessage);
  }

  public searchGeneral(): void {
    this.calculationEventService.emit(true);
    var foundOsmEntity = this.citiesService
      .searchGeneralInstitutionContentInDatabase(this.institutionQueryParam, 10)
      .subscribe(
        (result) => {
          var dialogViewdata: SelectionDialogViewData[] =
            this.convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result);
          this.renderResult(dialogViewdata);
        },
        (err) => this.errorOnRequest(err)
      );
  }

  public searchCity(): void {
    this.calculationEventService.emit(true);
    var foundOsmEntity = this.citiesService
      .searchCityInOsmFile(this.city, 10)
      .subscribe(
        (result) => {
          var dialogViewdata: SelectionDialogViewData[] =
            this.convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result);
          this.renderResult(dialogViewdata);
        },
        (err) => this.errorOnRequest(err)
      );
  }

  private convertOsmPoiEntityArrayToSelectionDialogViewDataArray(
    result: OsmPOIEntity[]
  ) {
    var dialogViewdata: SelectionDialogViewData[] = [];
    result.forEach((e) => {
      dialogViewdata.push(
        new SelectionDialogViewData(
          e.primaryValue,
          e.secondaryValue,
          e.latVal,
          e.longVal
        )
      );
    });
    return dialogViewdata;
  }

  public showAllInstitutions(): void {
    this.calculationEventService.emit(true);
    var foundOsmEntity = this.schoolService
      .getAllSchoolsOrderedByName()
      .subscribe(
        (result) => {
          var dialogViewdata: SelectionDialogViewData[] = [];
          result.forEach((e) => {
            var subtitle = "Für weitere Informationen klicken";
            if (subtitle.length > 0) {
              subtitle = "";
              e.personSchoolMapping.forEach((mapping) => {
                subtitle += mapping.functionality.name + " & ";
              });
              subtitle = subtitle.substring(0, subtitle.length - 3);
            }
            //Seems like latlong are swapped for schools. be careful when fixing this
            dialogViewdata.push(
              new SelectionDialogViewData(
                e.schoolName,
                subtitle,
                e.longitude,
                e.latitude
              )
            );
          });
          this.showSelectDialog(
            dialogViewdata,
            "Alle eingetragenen Institutionen",
            "Bitte wählen Sie die gesuchte Institution aus"
          );
        },
        (err) => this.errorOnRequest(err)
      );
  }

  private errorOnRequest(err) {
    this.calculationEventService.emit(false);
    this.toastr.error(
      "Es ist ein Fehler aufgetreten! Bitte kontaktieren Sie den Betreiber"
    );
  }

  private renderResult(result: SelectionDialogViewData[]) {
    if (result.length == 1) {
      this.renderNewPositionInMainApp(result[0]);
    } else if (result.length == 0) {
      this.toastr.error(
        "Es wurden leider keine Ergebnisse gefunden. Bitte überprüfen Sie die eingegebenen Werte!"
      );
    } else {
      this.showSelectDialog(
        result,
        "Passende Werte",
        "Bitte wählen Sie aus den gefunden Ergebnissen das Passende aus"
      );
    }
  }

  private showSelectDialog(result, headline: string, underline: string) {
    const dialog = this.dialog.open(SearchSelectionComponent, {
      width: "250px",
      data: { cardData: result, headline: headline, underheadline: underline },
    });
    dialog.afterClosed().subscribe((result) => {
      this.renderNewPositionInMainApp(result);
    });
  }

  public searchStreet(): void {
    this.calculationEventService.emit(true);
    this.citiesService
      .searchCityAndStreetInOsmFile(
        this.city,
        this.streetname,
        this.housenumber,
        10
      )
      .subscribe(
        (result) => {
          var dialogViewdata: SelectionDialogViewData[] =
            this.convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result);
          this.renderResult(dialogViewdata);
        },
        (err) => this.errorOnRequest(err)
      );
  }

  public searchSchool(): void {
    this.calculationEventService.emit(true);
    var foundOsmEntity = this.schoolService
      .searchSchoolInOsmFile(this.schoolname, this.city, 10)
      .subscribe(
        (result) => {
          var dialogViewdata: SelectionDialogViewData[] =
            this.convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result);
          this.renderResult(dialogViewdata);
        },
        (err) => this.errorOnRequest(err)
      );
  }

  private renderNewPositionInMainApp(result: SelectionDialogViewData) {
    this.calculationEventService.emit(false);
    this.zoomEventService.emit(
      new ZoomEventMessage(result.getLatitude(), result.getLongitude(), 17)
    );
  }

  public searchExact(): void {
    if (!this.isAdmin()) {
    } else {
    }
  }

  public resetClicked() {
    this.selectedCriterias = [];
    this.mapUpdateEventService.emit(true);
    this.toggleShowRegionAreas();
  }

  public schoolTypeSelectChange(val) {
    this.selectChange(val, this.selectedSchoolTypes);
  }

  public criteriaSelectChange(val) {
    this.selectChange(val, this.selectedCriterias);
  }

  private selectChange(val, matchingArray: any[]) {
    var elementFoundIdx = matchingArray.indexOf(val);
    console.log(elementFoundIdx);
    console.log(val);
    if (elementFoundIdx == -1) {
      matchingArray.push(val);
    } else {
      matchingArray.splice(elementFoundIdx, 1);
    }
    this.mapUpdateEventService.emit(true);
    this.toggleShowRegionAreas();
  }

  public trackItem(index: number, item: CriteriaEntity) {
    return item.id;
  }

  public isAdmin(): boolean {
    return BaseService.isLoggedIn();
  }

  toggleSearchType() {
    this.mapUpdateEventService.emit(true);
    this.toggleShowRegionAreas();
  }

  public toggleShowRegionAreas() {
    var strategyToExecute: VisibilityEventStrategy;
    if (this.showRegionAreas) {
      strategyToExecute = new AreaShowEventStrategy(this.areaService);
    } else {
      strategyToExecute = new AreaHideEventStrategy();
    }
    this.visibilityEventService.emit(strategyToExecute);
  }
}
