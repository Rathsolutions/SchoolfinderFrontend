//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonEntity } from '../../entities/PersonEntity';
import { SchoolsService } from '../../services/schools.service';
import { PersonsService } from '../../services/persons.service';
import { PersonFunctionality } from '../../entities/PersonFunctionalityEntity';
import { AbstractPersonViewData } from '../../viewdata/AbstractPersonViewData';
import { SchoolPersonEntity } from 'src/app/entities/SchoolPersonEntity';

export abstract class PointOverlay implements AfterViewInit, OnDestroy {

    collapsedHeight = '50px';

    visible: boolean = false;

    arPerson: AbstractPersonViewData = this.getPersonViewDataInstance();
    makerspacePerson: AbstractPersonViewData = this.getPersonViewDataInstance();

    public schoolName: FormControl = new FormControl('', Validators.required);
    public arContent: FormControl = new FormControl('');
    image: string = null;
    protected schoolId: number;

    constructor(protected schoolsService: SchoolsService, protected personsService: PersonsService) {
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }
    public prepareNewSchool() {
        this.arPerson = this.getPersonViewDataInstance();
        this.makerspacePerson = this.getPersonViewDataInstance();
        this.image = null;
        this.schoolId = null;
        this.schoolName = new FormControl('', Validators.required);
        this.arContent = new FormControl('');
    }

    async loadNewSchool(id: number) {
        this.prepareNewSchool();
        this.schoolsService.getSchoolDetails(id).subscribe(result => {
            this.schoolId = result.id;
            this.schoolName.setValue(result.schoolName);
            this.arContent.setValue(result.arContent);
            result.personSchoolMapping.forEach(e => {
                if (e.functionality == PersonFunctionality.AR.toString().toUpperCase()) {
                    this.arPerson = this.getPersonViewDataInstance();
                    this.arPerson.prefill(e.person);
                } else if (e.functionality == PersonFunctionality.MAKERSPACE.toString().toUpperCase()) {
                    this.makerspacePerson = this.getPersonViewDataInstance();
                    this.makerspacePerson.prefill(e.person);
                }
            });
            if (result.schoolPicture) {
                var buffer = new ArrayBuffer(result.schoolPicture.length);
                var intArray = new Uint8Array(buffer);
                for (let i = 0; i < result.schoolPicture.length; i++) {
                    intArray[i] = result.schoolPicture.charCodeAt(i);
                }
                this.image = result.schoolPicture;
            } else {
                this.image = null;
            }

        });
    }

    protected abstract getPersonViewDataInstance(): AbstractPersonViewData;

    onSubmit(data) {

    }

    ngAfterViewInit() {
    }

    ngOnDestroy() { }
}