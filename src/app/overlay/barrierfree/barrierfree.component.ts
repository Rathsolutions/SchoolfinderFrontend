import { Component } from '@angular/core';
import { SchoolsService } from 'src/app/services/schools.service';
import { SchoolPersonEntity } from 'src/app/entities/SchoolPersonEntity';
import { TransitionCheckState } from '@angular/material/checkbox';
import { PersonEntity } from 'src/app/entities/PersonEntity';
import { PersonFunctionality } from 'src/app/entities/PersonFunctionalityEntity';

@Component({
    selector: 'barrierfree-component',
    templateUrl: './barrierfree.component.html',
    styleUrls: ['./barrierfree.component.css'],
})
export class BarrierFree {

    displayedColumns: string[] = ['name', 'arContent', 'makerspaceContent'];
    data: SchoolPersonEntity[];

    constructor(protected schoolsService: SchoolsService) {
        schoolsService.getAllSchools().subscribe(result => {
            this.data = result;
            console.log(result);
        });
    }

    public getContentTextForPerson(school: SchoolPersonEntity, functionality: PersonFunctionality): string {
        switch (functionality) {
            case PersonFunctionality.XR:
                return school.arContent;
            case PersonFunctionality.MAKERSPACE:
                return school.makerspaceContent;
        }
    }
}