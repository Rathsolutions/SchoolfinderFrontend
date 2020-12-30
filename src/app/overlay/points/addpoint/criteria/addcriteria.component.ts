//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CriteriaService } from '../../../../services/criteria.service';

@Component({
    selector: 'addcriteria-component',
    templateUrl: './addcriteria.component.html',
    styleUrls: ['./addcriteria.component.css']
})
export class AddCriteriaComponent {

    criteriaName: FormControl = new FormControl('');
    newPointForm: FormGroup;
    possibleCriterias: string[] = [];

    collapsedHeight = '5vh';

    constructor(private criteriaService: CriteriaService) {
        this.criteriaName.valueChanges.subscribe(data => {
            this.updateCriteriaCache(data);
        });
    }

    public setNewPointForm(newPointForm: FormGroup) {
        this.newPointForm = newPointForm;
    }

    public autocompleteChoosen(value) {
    }

    public criteriaClicked() {
        this.updateCriteriaCache('');
    }

    private updateCriteriaCache(data:string): void {
        this.criteriaService.getPossibleCriterias(data, 5).subscribe(result => {
            this.possibleCriterias = [];
            console.log(result);
            result.forEach(e => this.possibleCriterias.push(e.criteriaName));
        });
    }

}