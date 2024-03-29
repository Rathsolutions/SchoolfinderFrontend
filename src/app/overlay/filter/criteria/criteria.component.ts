//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CriteriaService } from '../../../services/criteria.service';
import { CriteriaEntity } from 'src/app/entities/CriteriaEntity';
import { MainComponent } from 'src/app/overlay/main/main.component';
import { SchoolsService } from '../../../services/schools.service';
import { BaseService } from 'src/app/services/base.service';
import { UserService } from 'src/app/services/user.service';
import { CitiesService } from 'src/app/services/cities.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchSelectionComponent } from '../../..//dialogs/searchSelection.component';
import { OsmPOIEntity } from '../../../entities/OsmPOIEntity';
import { SelectionDialogViewData } from 'src/app/viewdata/SelectionDialogViewData';

@Component({
    selector: 'criteria-filter-component',
    templateUrl: './criteria.component.html',
    styleUrls: ['./criteria.component.css']
})
export class CriteriaFilterComponent implements OnInit {

    allCriterias: CriteriaEntity[] = [];
    selectedCriterias: CriteriaEntity[] = [];
    mainAppComponent: MainComponent;
    schoolname: string;
    streetname: string;
    housenumber: string;
    city: string = "";
    amount: number;
    exclusiveSearch: boolean = false;

    constructor(private criteriaService: CriteriaService, private toastr: ToastrService, private schoolService: SchoolsService, private citiesService: CitiesService, private dialog: MatDialog) {

    }
    ngOnInit(): void {
        this.criteriaService.getAllCriterias().subscribe(result => {
            console.log(result);
            result.forEach(e => this.allCriterias.push(e));
        });
    }

    public searchCity(): void {
        this.mainAppComponent.setCalculationInProgress(true);
        var foundOsmEntity = this.citiesService.searchCityInOsmFile(this.city, 10).subscribe(result => {
            var dialogViewdata: SelectionDialogViewData[] = this.convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result);
            this.renderResult(dialogViewdata);
        }, err => this.errorOnRequest(err));
    }

    private convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result: OsmPOIEntity[]) {
        var dialogViewdata: SelectionDialogViewData[] = [];
        result.forEach(e => {
            dialogViewdata.push(new SelectionDialogViewData(e.primaryValue, e.secondaryValue, e.latVal, e.longVal));
        });
        return dialogViewdata;
    }

    public showAllInstitutions(): void {
        this.mainAppComponent.setCalculationInProgress(true);
        var foundOsmEntity = this.schoolService.getAllSchoolsOrderedByName().subscribe(result => {
            var dialogViewdata: SelectionDialogViewData[] = [];
            result.forEach(e => {
                var subtitle = "";
                if (e.arContent && e.makerspaceContent) {
                    subtitle = "XR & Makerspace";
                } else if (e.arContent) {
                    subtitle = "XR";
                } else if (e.makerspaceContent) {
                    subtitle = "Makerspace";
                } else {
                    subtitle = "Für weitere Informationen klicken"
                }
                //Seems like latlong are swapped for schools. be careful when fixing this
                dialogViewdata.push(new SelectionDialogViewData(e.schoolName, subtitle, e.longitude, e.latitude));
            })
            this.showSelectDialog(dialogViewdata, "Alle eingetragenen Institutionen", "Bitte wählen Sie die gesuchte Institution aus");
        }, err => this.errorOnRequest(err));
    }

    private errorOnRequest(err) {
        this.mainAppComponent.setCalculationInProgress(false);
        this.toastr.error("Es ist ein Fehler aufgetreten! Bitte kontaktieren Sie den Betreiber");
    }

    private renderResult(result: SelectionDialogViewData[]) {
        if (result.length == 1) {
            this.renderNewPositionInMainApp(result[0]);
        } else if (result.length == 0) {
            this.toastr.error("Es wurden leider keine Ergebnisse gefunden. Bitte überprüfen Sie die eingegebenen Werte!")
        }
        else {
            this.showSelectDialog(result, "Passende Werte", "Bitte wählen Sie aus den gefunden Ergebnissen das Passende aus");
        }
    }

    private showSelectDialog(result, headline: string, underline: string) {
        const dialog = this.dialog.open(SearchSelectionComponent, {
            width: '250px',
            data: { cardData: result, headline: headline, underheadline: underline }
        });
        dialog.afterClosed().subscribe(result => {
            this.renderNewPositionInMainApp(result);
        });
    }

    public searchStreet(): void {
        this.mainAppComponent.setCalculationInProgress(true);
        this.citiesService.searchCityAndStreetInOsmFile(this.city, this.streetname, this.housenumber, 10).subscribe(result => {
            var dialogViewdata: SelectionDialogViewData[] = this.convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result);
            this.renderResult(dialogViewdata);
        }, err => this.errorOnRequest(err));
    }

    public searchSchool(): void {
        this.mainAppComponent.setCalculationInProgress(true);
        var foundOsmEntity = this.schoolService.searchSchoolInOsmFile(this.schoolname, this.city, 10).subscribe(result => {
            var dialogViewdata: SelectionDialogViewData[] = this.convertOsmPoiEntityArrayToSelectionDialogViewDataArray(result);
            this.renderResult(dialogViewdata);
        }, err => this.errorOnRequest(err));
    }

    private renderNewPositionInMainApp(result: SelectionDialogViewData) {
        this.mainAppComponent.setCalculationInProgress(false);
        this.mainAppComponent.zoomTo(result.getLatitude(), result.getLongitude(), 17);
        this.mainAppComponent.resetAllWaypoint();
        this.mainAppComponent.updateWaypoints();
    }

    public searchExact(): void {
        if (!this.isAdmin()) {

        } else {

        }
    }

    public resetClicked() {
        this.selectedCriterias = [];
        this.mainAppComponent.resetAllWaypoint();
        this.mainAppComponent.updateWaypoints();
    }

    public selectChange(val) {
        this.selectedCriterias = val;
        this.mainAppComponent.resetAllWaypoint();
        this.mainAppComponent.updateWaypoints();
    }

    public trackItem(index: number, item: CriteriaEntity) {
        return item.id;
    }

    public isAdmin(): boolean {
        return BaseService.isLoggedIn();
    }

    toggleSearchType() {
        this.mainAppComponent.resetAllWaypoint();
        this.mainAppComponent.updateWaypoints();
    }
}