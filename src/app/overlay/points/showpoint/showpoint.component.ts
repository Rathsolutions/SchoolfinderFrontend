//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonEntity } from 'src/app/entities/PersonEntity';
import { SchoolsService } from '../../../services/schools.service';
import { PersonFunctionality } from 'src/app/entities/PersonFunctionalityEntity';
import { PointOverlay } from '../pointoverlay.component';
import { PersonsService } from 'src/app/services/persons.service';
import { AbstractPersonViewData } from "../../../viewdata/AbstractPersonViewData";
import { ViewOnlyPersonViewData } from "../../../viewdata/ViewOnlyPersonViewData";
import * as olPixel from 'ol/pixel';

@Component({
    selector: 'showpoint-component',
    templateUrl: './showpoint.component.html',
    styleUrls: ['./showpoint.component.css']
})
export class ShowPointOverlay extends PointOverlay implements AfterViewInit, OnDestroy {

    currentFontRatio = 1.0;

    collapsedHeight = '60px';

    visible: boolean = false;

    image: string = null;

    constructor(protected schoolsService: SchoolsService, protected personsService: PersonsService) {
        super(schoolsService, null);
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }
    protected getPersonViewDataInstance(): AbstractPersonViewData {
        return new ViewOnlyPersonViewData(this.personsService);
    }
    onSubmit(data) {

    }

    ngAfterViewInit() {
    }

    ngOnDestroy() { }
}
