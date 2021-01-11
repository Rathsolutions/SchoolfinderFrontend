//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CriteriaService } from '../../../services/criteria.service';
import { CriteriaEntity } from 'src/app/entities/CriteriaEntity';
import { AppComponent } from '../../../app.component';
import { SchoolsService } from '../../../services/schools.service';
import { BaseService } from 'src/app/services/base.service';
import { UserService } from 'src/app/services/user.service';
import { CitiesService } from 'src/app/services/cities.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchSelectionComponent } from '../../..//dialogs/searchSelection.component';
import { OsmPOIEntity } from '../../../entities/OsmPOIEntity';

@Component({
    selector: 'criteria-filter-component',
    templateUrl: './criteria.component.html',
    styleUrls: ['./criteria.component.css']
})
export class CriteriaFilterComponent implements OnInit {

    allCriterias: CriteriaEntity[] = [];
    selectedCriterias: CriteriaEntity[] = [];
    mainAppComponent: AppComponent;
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
        var foundOsmEntity = this.citiesService.searchCityInOsmFile(this.city, 10).subscribe(result => {
            this.renderResult(result);
        });
    }

    private renderResult(result: OsmPOIEntity[]) {
        if (result.length == 1) {
            this.renderNewPositionInMainApp(result[0]);
        } else if (result.length == 0) {
            this.toastr.error("Es wurden leider keine Ergebnisse gefunden. Bitte überprüfen Sie die eingegebenen Werte!")
        }
        else {
            const dialog = this.dialog.open(SearchSelectionComponent, {
                width: '250px',
                data: { result }
            });
            dialog.afterClosed().subscribe(result => {
                this.renderNewPositionInMainApp(result);
            });
        }
    }

    public searchStreet(): void {
        this.citiesService.searchCityAndStreetInOsmFile(this.city, this.streetname, this.housenumber, 10).subscribe(result => {
            console.log(result);
            this.renderResult(result);
        });
    }

    public searchSchool(): void {
        var foundOsmEntity = this.schoolService.searchSchoolInOsmFile(this.schoolname, this.city, 10).subscribe(result => {
            this.renderResult(result);
        });
    }

    private renderNewPositionInMainApp(result: OsmPOIEntity) {
        this.mainAppComponent.zoomTo(result.latVal, result.longVal, 17);
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