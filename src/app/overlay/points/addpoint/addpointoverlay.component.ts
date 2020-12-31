//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { ComponentFactoryResolver, Component, ComponentRef, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SchoolsService } from '../../../services/schools.service';
import { PersonsService } from '../../../services/persons.service';
import { PersonEntity } from '../../../entities/PersonEntity';
import { AddCriteriaComponent } from './criteria/addcriteria.component';
import { SchoolPersonEntity } from '../../../entities/SchoolPersonEntity';
import { PersonFunctionalityEntity, PersonFunctionality } from '../../../entities/PersonFunctionalityEntity';
import { PointOverlay } from '../pointoverlay.component';
import { AbstractPersonViewData } from "../../../viewdata/AbstractPersonViewData";
import { EditablePersonViewData } from "../../../viewdata/EditablePersonViewData";
import { CriteriaEntity } from 'src/app/entities/CriteriaEntity';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'addpointeroverlay-component',
    templateUrl: './addpointoverlay.component.html',
    styleUrls: ['./addpointoverlay.component.css']
})
export class AddPointOverlay extends PointOverlay implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('criteriaPlaceholder', { read: ViewContainerRef }) criteriaPlaceholder: ViewContainerRef;

    schoolPicture: FormControl = new FormControl('');
    criterias: AddCriteriaComponent[] = [];
    lat: number;
    long: number;

    collapsedHeight = '10vh';

    visible: boolean;
    prefilled: boolean = false;
    newPointForm: FormGroup

    constructor(
        private formBuilder: FormBuilder,
        protected schoolService: SchoolsService,
        protected personsService: PersonsService,
        private toastr: ToastrService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private mainApp: AppComponent
    ) {
        super(schoolService, personsService);
    }

    ngOnInit(): void {
        this.arPerson = this.getPersonViewDataInstance();
        this.makerspacePerson = this.getPersonViewDataInstance();
        this.init();
    }

    private init() {
        this.newPointForm = this.formBuilder.group({
            schoolName: this.schoolName,
            arContent: this.arContent,
            arPerson: this.arPerson,
            makerspacePerson: this.makerspacePerson
        });
        this.arPerson.setNewPointForm(this.newPointForm);
        this.makerspacePerson.setNewPointForm(this.newPointForm);
        this.prefilled = false;
    }
    public prepareNewSchool() {
        super.prepareNewSchool();
        this.removeAllCriteriaButtons();
        this.init();
    }
    setVisible(visible: boolean) {
        this.visible = visible;
        this.criteriaPlaceholder.clear();
        this.arPerson.resetValues();
        this.makerspacePerson.resetValues();
        this.schoolName.reset();
        this.arContent.reset();
        this.newPointForm.reset();
    }

    handleFileInput(files: FileList) {
        var file = files.item(0);
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onloadend = () => {
            this.image = "data:image/gif;base64," + btoa(reader.result.toString());
        };
    }

    deleteCurrent(): void {
        this.schoolService.deleteSchool(this.schoolId).subscribe(result => {
            this.toastr.success("Die Schule '" + this.schoolName.value + "' wurde erfolgreich gelöscht!");
            this.setVisible(false);
            this.mainApp.resetAllWaypoint();
            this.mainApp.updateWaypoints();
        }, err => {
            this.toastr.error("Es ist ein Fehler aufgetreten!");
        });
    }

    async onSubmit() {
        if (this.newPointForm.invalid) {
            this.toastr.error("Das Formular ist nicht vollständig ausgefüllt!");
            return;
        }
        if (!this.arPerson.isFilled() && !this.makerspacePerson.isFilled()) {
            this.toastr.error("Bitte mindestens eine Ansprechperson für entweder AR oder Makerspace eintragen!");
            return;
        }
        if (this.arPerson.isAtLeastOneFilled() && !this.arPerson.isFilled()) {
            this.toastr.error("Bitte füllen Sie die AR-Person vollständig aus!");
            return;
        }
        if (this.makerspacePerson.isAtLeastOneFilled() && !this.makerspacePerson.isFilled()) {
            this.toastr.error("Bitte füllen Sie die Makerspace-Person vollständig aus!");
            return;
        }
        var school: SchoolPersonEntity = new SchoolPersonEntity;
        school.id = this.schoolId;
        school.latitude = this.lat;
        school.longitude = this.long;
        school.schoolName = this.schoolName.value;
        school.arContent = this.arContent.value;
        var errorInCallback = false;
        await this.getOrInsertPerson(this.arPerson, school, PersonFunctionality.AR).then(val => {
            if (val != null) {
                school.personSchoolMapping.push(val);
            }
        }).catch(err => {
            errorInCallback = err;
        });
        await this.getOrInsertPerson(this.makerspacePerson, school, PersonFunctionality.MAKERSPACE).then(val => {
            if (val != null) {
                school.personSchoolMapping.push(val);
            }
        }).catch(err => {
            errorInCallback = err;
        });;
        if (errorInCallback) {
            return;
        }
        this.criterias.forEach(e => {
            var criteriaEntity = new CriteriaEntity();
            criteriaEntity.criteriaName = e.criteriaName.value;
            school.matchingCriterias.push(criteriaEntity);
        })
        school.schoolPicture = this.image;
        var observableSchool;
        var successMessage;
        if (this.prefilled) {
            observableSchool = this.schoolService.patchSchool(school);
            successMessage = "aktualisiert!";
        } else {
            observableSchool = this.schoolService.putNewSchool(school);
            successMessage = "eingetragen!";
        }
        observableSchool.subscribe(result => {
            this.criteriaPlaceholder.clear();
            this.arPerson.resetValues();
            this.makerspacePerson.resetValues();
            this.schoolName.reset();
            this.arContent.reset()
            this.newPointForm.reset();
            this.toastr.success("Die Schule wurde erfolgreich " + successMessage);
            this.setVisible(false);
        }, error => {
            if (error.status == 409) {
                this.toastr.error("Diese Schule existiert schon! Bitte an anderer Stelle löschen und erneut versuchen");
            } else {
                this.toastr.error("Es ist ein Fehler aufgetreten, bitte alle Werte überprüfen!");
            }
        });
    }

    private async getOrInsertPerson(personToInsert: AbstractPersonViewData, school: SchoolPersonEntity, functionality: PersonFunctionality): Promise<PersonFunctionalityEntity> {
        var errorInCallback = false;
        if (personToInsert && personToInsert.isFilled()) {
            var arPerson;
            var personNotExisting = false;
            await this.getPersonFromBackend(personToInsert.toPersonEntity()).then(result => arPerson = result).catch(err => {
                if (err.status == 404) {
                    personNotExisting = true;
                } else if (err.status == 400) {
                    this.toastr.error("Die E-Mail Adresse der AR Person stimmt nicht mit den bereits gespeicherten Angaben von Vor - und Nachnahmen sowie Telefonnummer überein!");
                    errorInCallback = true;
                }
            });
            if (personNotExisting) {
                await this.persistPerson(personToInsert.toPersonEntity()).then(result => arPerson = result).catch(err => {
                    if (err.status == 400) {
                        this.toastr.error("Die E-Mail Adresse der AR Person stimmt nicht mit den bereits gespeicherten Angaben von Vor - und Nachnahmen sowie Telefonnummer überein!");
                        errorInCallback = true;
                    }
                });
            }
            if (errorInCallback) {
                return new Promise<PersonFunctionalityEntity>((resolve, reject) => {
                    reject(false);
                });
            }
            var personSchoolMappingId: number;
            if (school.id != null && arPerson.id != null) {
                await this.schoolService.findPersonFunctionalityForPersonSchoolMapping(school.id, arPerson.id, functionality).toPromise().then(result => personSchoolMappingId = result).catch(err => {
                    if (err.status == 404) {
                        personSchoolMappingId = null;
                    }
                });
            }
            console.log(arPerson);
            var currentPersonFunctionalityEntity = new PersonFunctionalityEntity(personSchoolMappingId, functionality, new PersonEntity(arPerson.id));
            return new Promise<PersonFunctionalityEntity>((resolve, reject) => {
                if (!errorInCallback) {
                    resolve(currentPersonFunctionalityEntity);
                } else {
                    reject(false);
                }
            });

        } else {
            return new Promise<PersonFunctionalityEntity>((resolve, reject) => {
                resolve(null);
            });
        }
    }

    public prefillByPointId(pointId: number): void {
        this.arPerson = this.getPersonViewDataInstance();
        this.makerspacePerson = this.getPersonViewDataInstance();
        this.loadNewSchool(pointId);
        this.init();
        this.prefilled = true;
        this.schoolsService.getSchoolDetails(pointId).subscribe(result => {
            result.matchingCriterias.forEach(e => {
                var currentComponent = this.addCriteriaButton();
                currentComponent.instance.criteriaName.setValue(e.criteriaName);
            });
        });
    }

    private async getPersonFromBackend(person: PersonEntity): Promise<PersonEntity> {
        var personFromDb = this.personsService.getPerson(person.prename, person.lastname, person.email).toPromise();
        return personFromDb;
    }
    private async existsPersonFromBackend(person: PersonEntity): Promise<Boolean> {
        var personFromDb = this.personsService.getPersonExists(person.prename, person.lastname, person.email).toPromise();
        return personFromDb;
    }

    private async persistPerson(person: PersonEntity): Promise<PersonEntity> {
        var personFromDb = this.personsService.putNewPerson(person).toPromise();
        return personFromDb;
    }

    addCriteriaButton(): ComponentRef<AddCriteriaComponent> {
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(AddCriteriaComponent);
        var component = this.criteriaPlaceholder.createComponent(componentFactory);
        this.criterias.push(component.instance);
        return component;
    }

    removeCriteriaButton() {
        this.criteriaPlaceholder.remove();
    }

    removeAllCriteriaButtons() {
        this.criteriaPlaceholder.clear();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() { }

    protected getPersonViewDataInstance(): AbstractPersonViewData {
        return new EditablePersonViewData(this.personsService);
    }


    public setLat(lat: number): void {
        this.lat = lat;
    }

    public setLong(long: number): void {
        this.long = long;
    }
}