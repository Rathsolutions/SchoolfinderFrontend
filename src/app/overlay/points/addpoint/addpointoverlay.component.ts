//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import {
  ComponentFactoryResolver,
  Component,
  ComponentRef,
  Type,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
  OnInit,
  ViewContainerRef,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SchoolsService } from "../../../services/schools.service";
import { PersonsService } from "../../../services/persons.service";
import { PersonEntity } from "../../../entities/PersonEntity";
import { AddCriteriaComponent } from "./criteria/addcriteria.component";
import { SchoolPersonEntity } from "../../../entities/SchoolPersonEntity";
import { PersonFunctionalityEntity } from "../../../entities/PersonFunctionalityEntity";
import { PointOverlay } from "../pointoverlay.component";
import { AbstractPersonViewData } from "../../../viewdata/AbstractPersonViewData";
import { AddPersonComponent } from "../../../viewdata/editable-person/addperson.component";
import { CriteriaEntity } from "src/app/entities/CriteriaEntity";
import { MainComponent } from "src/app/overlay/main/main.component";
import { ThemePalette } from "@angular/material/core";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { ProjectCategoryEntity } from "src/app/entities/ProjectEntity";

@Component({
  selector: "addpointeroverlay-component",
  templateUrl: "./addpointoverlay.component.html",
  styleUrls: ["./addpointoverlay.component.css"],
})
export class AddPointOverlay
  extends PointOverlay
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild("criteriaPlaceholder", { read: ViewContainerRef })
  criteriaPlaceholder: ViewContainerRef;

  @ViewChild("addPersonOverlay", { read: ViewContainerRef })
  addPersonOverlay: ViewContainerRef;

  schoolPicture: FormControl = new FormControl("");
  criterias: AddCriteriaComponent[] = [];
  lat: number;
  long: number;

  projectCategories: ProjectCategoryEntity[] = [];
  private personsComponent: AddPersonComponent[] = [];

  collapsedHeight = "10vh";

  public color: ThemePalette = "primary";
  public touchUi = false;

  visible: boolean;
  prefilled: boolean = false;
  newPointForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    protected schoolService: SchoolsService,
    protected personsService: PersonsService,
    private toastr: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private projectCategoryService: ProjectCategoryService,
    private saveEventService: MapUpdateEventService
  ) {
    super(schoolService, personsService);
    this.init();
    this.projectCategoryService.findAll().subscribe((res) => {
      res.forEach((e) => {
        this.projectCategories.push(e);
      });
    });
  }

  ngOnInit(): void {}

  private init() {
    this.newPointForm = this.formBuilder.group({
      shortSchoolName: this.shortSchoolName,
      schoolName: this.schoolName,
      schoolPicture: this.schoolPicture,
      projectCategory: this.projectCategory,
      projectPrimaryCategory: this.projectPrimaryCategory,
      alternativePictureText: this.alternativePictureText,
    });
    this.criterias = [];
    this.prefilled = false;
  }

  public prepareNewSchool() {
    super.prepareNewSchool();
    this.removeAllCriteriaButtons();
    this.init();
  }
  setVisible(visible: boolean) {
    this.visible = visible;
    this.resetForm();
  }

  public addPersonButton(): AddPersonComponent {
    var addPersonComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AddPersonComponent);
    var personInstance = this.addPersonOverlay.createComponent(
      addPersonComponentFactory
    ).instance;
    personInstance.removeListener.subscribe((res: AddPersonComponent) => {
      var remainingPersons = [];
      var i = 0;
      this.personsComponent.forEach((e) => {
        if (e != res) {
          remainingPersons.push(e);
        } else {
          this.addPersonOverlay.remove(i);
        }
        i++;
      });
      this.personsComponent = remainingPersons;
    });
    this.personsComponent.push(personInstance);
    return personInstance;
  }

  resetForm() {
    if (this.criteriaPlaceholder) {
      this.criteriaPlaceholder.clear();
    }
    this.schoolName.reset();
    // this.colorCtr.reset();
    this.newPointForm.reset();
    this.schoolPicture.reset();
    this.projectCategory.reset();
    this.projectPrimaryCategory.reset();
    this.alternativePictureText.reset();
    this.criterias = [];
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
    this.schoolService.deleteSchool(this.schoolId).subscribe(
      (result) => {
        this.toastr.success(
          "Die Institution '" +
            this.schoolName.value +
            "' wurde erfolgreich gelöscht!"
        );
        this.setVisible(false);
        this.saveEventService.emit(true);
      },
      (err) => {
        this.toastr.error("Es ist ein Fehler aufgetreten!");
      }
    );
  }

  async onSubmit() {
    if (this.newPointForm.invalid) {
      this.toastr.error("Das Formular ist nicht vollständig ausgefüllt!");
      return;
    }

    var school: SchoolPersonEntity = new SchoolPersonEntity();
    school.id = this.schoolId;
    school.latitude = this.lat;
    school.longitude = this.long;
    school.shortSchoolName = this.shortSchoolName.value;
    school.schoolName = this.schoolName.value;
    school.primaryProject = this.projectPrimaryCategory.value;
    // school.color = this.colorCtr.value.hex;

    var allPersonViewInstances: PersonFunctionalityEntity[] = [];
    var promisesToWait: Promise<PersonFunctionalityEntity>[] = [];
    this.personsComponent.forEach(async (person) => {
      promisesToWait.push(
        person.getOrInsertPerson().then((e) => {
          console.log(e);
          allPersonViewInstances.push(e);
          return e;
        })
      );
    });
    this.criterias.forEach((e) => {
      var criteriaEntity = new CriteriaEntity();
      criteriaEntity.criteriaName = e.criteriaName.value;
      school.matchingCriterias.push(criteriaEntity);
    });
    this.projectCategory.value.forEach((element) => {
      school.projects.push(element);
    });
    if (this.image) {
      school.schoolPicture = this.image;
      school.alternativePictureText = this.alternativePictureText.value;
    }
    Promise.all(promisesToWait)
      .then((res) => {
        if (allPersonViewInstances.length <= 0) {
          this.toastr.error("Bitte mindestens eine Ansprechperson eintragen!");
          return;
        }
        res.forEach((e) => {
          school.personSchoolMapping.push(e);
        });
        console.log(school.personSchoolMapping);
        var observableSchool: Observable<SchoolPersonEntity>;
        var successMessage: string;
        if (this.prefilled) {
          observableSchool = this.schoolService.patchSchool(school);
          successMessage = "aktualisiert!";
        } else {
          observableSchool = this.schoolService.putNewSchool(school);
          successMessage = "eingetragen!";
        }
        observableSchool.subscribe(
          (result) => {
            this.resetForm();
            this.toastr.success(
              "Die Institution wurde erfolgreich " + successMessage
            );
            this.setVisible(false);
            this.saveEventService.emit(true);
          },
          (error) => {
            if (error.status == 409) {
              this.toastr.error(
                "Diese Institution existiert schon! Bitte an anderer Stelle löschen und erneut versuchen"
              );
            } else {
              this.toastr.error(
                "Es ist ein Fehler aufgetreten, bitte alle Werte überprüfen!"
              );
            }
          }
        );
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }

  public prefillByPointId(pointId: number): void {
    this.init();
    this.loadNewSchool(pointId).then((res: SchoolPersonEntity) => {
      var matchingProjects = [];
      res.projects.forEach((e) => {
        var curProjInstance = this.projectCategories.filter(
          (p) => p.id == e.id
        )[0];
        if (curProjInstance) {
          matchingProjects.push(curProjInstance);
          if (curProjInstance.id == res.primaryProject.id) {
            this.projectPrimaryCategory.setValue(curProjInstance);
          }
        }
      });
      this.projectCategory.setValue(matchingProjects);
      this.prefilled = true;
      res.matchingCriterias.forEach((e) => {
        var currentComponent = this.addCriteriaButton();
        currentComponent.instance.criteriaName.setValue(e.criteriaName);
      });
    });
  }

  addCriteriaButton(): ComponentRef<AddCriteriaComponent> {
    var componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        AddCriteriaComponent
      );
    var component = this.criteriaPlaceholder.createComponent(componentFactory);
    component.instance.removeListener.subscribe((res) => {
      var remainingCriterias = [];
      var i = 0;
      this.criterias.forEach((e) => {
        if (e.criteriaName.value != res) {
          remainingCriterias.push(e);
        } else {
          this.criteriaPlaceholder.remove(i);
        }
        i++;
      });
      this.criterias = remainingCriterias;
    });
    this.criterias.push(component.instance);
    return component;
  }

  removeAllCriteriaButtons() {
    if (this.criteriaPlaceholder) {
      this.criteriaPlaceholder.clear();
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  protected appendPersonViewDataInstance(): AbstractPersonViewData {
    return this.addPersonButton();
  }

  public setLat(lat: number): void {
    this.lat = lat;
  }

  public setLong(long: number): void {
    this.long = long;
  }
}
