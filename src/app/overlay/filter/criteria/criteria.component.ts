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
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CriteriaService } from "../../../services/criteria.service";
import { CriteriaEntity } from "src/app/entities/CriteriaEntity";
import { MainComponent } from "src/app/overlay/main/main.component";
import { SchoolsService } from "../../../services/schools.service";
import { BaseService } from "src/app/services/base.service";
import { UserService } from "src/app/services/user.service";
import { CitiesService } from "src/app/services/cities.service";
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
import { InstitutionCategoryService } from "src/app/services/institution-category.service";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { CreateCategoryComponent } from "src/app/dialogs/category-management/create-category/create-category.component";
import { AbstractCategoryManagement } from "src/app/dialogs/category-management/abstract-category-management";

@Component({
  selector: "criteria-filter-component",
  templateUrl: "./criteria.component.html",
  styleUrls: ["./criteria.component.css"],
})
export class CriteriaFilterComponent implements OnInit {
  allCriterias: CriteriaEntity[] = [];
  selectedCriterias: CriteriaEntity[] = [];
  schoolname: string;
  streetname: string;
  housenumber: string;
  city: string = "";
  amount: number;
  exclusiveSearch: boolean = false;
  categoryName: string = "";
  step: number = 0;

  constructor(
    private criteriaService: CriteriaService,
    private toastr: ToastrService,
    private criteriaSelectionEventService: CriteriaSelectionEventService,
    private zoomEventService: ZoomToEventService,
    private mapUpdateEventService: MapUpdateEventService,
    private calculationEventService: CalculationEventService,
    private schoolService: SchoolsService,
    private citiesService: CitiesService,
    private institutionCategoryService: InstitutionCategoryService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.criteriaService.getAllCriterias().subscribe((result) => {
      console.log(result);
      result.forEach((e) => this.allCriterias.push(e));
    });
  }

  setStep(step: number): void {
    this.step = step;
  }

  public createCategory(): void {
    this.institutionCategoryService
      .findInstitutionCategoryByName(this.categoryName)
      .subscribe(
        (res) => {
          this.dialog.open(SchoolCategoryManagementComponent, {
            data: {
              adminNotice:
                "In dieser Ansicht haben Sie die Möglichkeit, die Kategorie " +
                res.name +
                " zu bearbeiten.",
              name: res.name,
              icon: res.icon,
              id: res.id,
            },
          });
        },
        (rej) => {
          //Comment in later
          // if (rej.status == 404) {
          var dialog = this.dialog.open(CreateCategoryComponent);
          dialog
            .afterClosed()
            .subscribe((res: Type<AbstractCategoryManagement<any, any>>) => {
              this.dialog.open(res, {
                data: {
                  adminNotice:
                    "In dieser Ansicht haben Sie die Möglichkeit, die Kategorie " +
                    this.categoryName +
                    " zu erstellen.",
                  name: this.categoryName,
                },
              });
            });
          // }
        }
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
            var subtitle = "";
            if (e.arContent && e.makerspaceContent) {
              subtitle = "XR & Makerspace";
            } else if (e.arContent) {
              subtitle = "XR";
            } else if (e.makerspaceContent) {
              subtitle = "Makerspace";
            } else {
              subtitle = "Für weitere Informationen klicken";
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
  }

  public selectChange(val) {
    this.selectedCriterias = val;
    this.mapUpdateEventService.emit(true);
  }

  public trackItem(index: number, item: CriteriaEntity) {
    return item.id;
  }

  public isAdmin(): boolean {
    // return BaseService.isLoggedIn();
    //only for testing purpose
    return true;
  }

  toggleSearchType() {
    this.mapUpdateEventService.emit(true);
  }
}
