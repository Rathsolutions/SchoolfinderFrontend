//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, Directive } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PersonEntity } from '../../entities/PersonEntity';
import { SchoolsService } from '../../services/schools.service';
import { PersonsService } from '../../services/persons.service';
import { PersonFunctionality } from '../../entities/PersonFunctionalityEntity';
import { AbstractPersonViewData } from '../../viewdata/AbstractPersonViewData';
import { SchoolPersonEntity } from 'src/app/entities/SchoolPersonEntity';
import { Color } from '@angular-material-components/color-picker';
import { parse } from 'url';

@Directive()
export abstract class PointOverlay implements AfterViewInit, OnDestroy {

    collapsedHeight = '50px';

    visible: boolean = false;

    arPerson: AbstractPersonViewData = this.getPersonViewDataInstance();
    makerspacePerson: AbstractPersonViewData = this.getPersonViewDataInstance();

    public schoolName: FormControl = new FormControl('', Validators.required);
    public shortSchoolName:FormControl = new FormControl('');
    public colorCtr: AbstractControl = new FormControl('#ff0000', [Validators.required, Validators.pattern("^#[0-9A-Fa-f]{6}$")]);
    public arContent: FormControl = new FormControl('');
    public makerspaceContent: FormControl = new FormControl('');
    image: string = null;
    public alternativePictureText: FormControl = new FormControl('');
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
        this.shortSchoolName = new FormControl('');
        this.arContent = new FormControl('');
        this.makerspaceContent = new FormControl('');
        this.alternativePictureText = new FormControl('');
    }

    async loadNewSchool(id: number) {
        this.prepareNewSchool();
        return new Promise(resolve => {

            this.schoolsService.getSchoolDetails(id).subscribe(result => {
                this.schoolId = result.id;
                this.shortSchoolName.setValue(result.shortSchoolName);
                this.schoolName.setValue(result.schoolName);
                this.arContent.setValue(result.arContent);
                this.makerspaceContent.setValue(result.makerspaceContent);
                console.log(result.color);
                if (result.color) {

                    var r = parseInt(result.color.substr(0, 2), 16);
                    var g = parseInt(result.color.substr(2, 2), 16);
                    var b = parseInt(result.color.substr(4, 2), 16);
                    this.colorCtr.setValue(new Color(r, g, b));
                } else {
                    this.colorCtr.setValue(new Color(255, 0, 0));
                }
                result.personSchoolMapping.forEach(e => {
                    if (e.functionality == PersonFunctionality.XR.toString().toUpperCase()) {
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
                    this.alternativePictureText.setValue(result.alternativePictureText);
                } else {
                    this.image = null;
                }
                resolve(result);
            });
        });
    }

    protected abstract getPersonViewDataInstance(): AbstractPersonViewData;

    onSubmit(data) {

    }

    ngAfterViewInit() {
    }

    ngOnDestroy() { }
}