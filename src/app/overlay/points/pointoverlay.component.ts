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
  Directive,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { PersonEntity } from "../../entities/PersonEntity";
import { SchoolsService } from "../../services/schools.service";
import { PersonsService } from "../../services/persons.service";
import { AbstractPersonViewData } from "../../viewdata/AbstractPersonViewData";
import { SchoolPersonEntity } from "src/app/entities/SchoolPersonEntity";
import { Color } from "@angular-material-components/color-picker";
import { parse } from "url";
import { ProjectCategoryEntity } from "src/app/entities/ProjectEntity";

@Directive()
export abstract class PointOverlay implements AfterViewInit, OnDestroy {
  collapsedHeight = "50px";

  visible: boolean = false;

  persons: AbstractPersonViewData[] = [];

  public schoolName: FormControl = new FormControl("", Validators.required);
  public shortSchoolName: FormControl = new FormControl("");
  // public colorCtr: AbstractControl = new FormControl("#ff0000", [
    // Validators.required,
    // Validators.pattern("^#[0-9A-Fa-f]{6}$"),
  // ]);

  public projectCategory: FormControl = new FormControl(
    "",
    Validators.required
  );
  image: string = null;
  public alternativePictureText: FormControl = new FormControl("");
  protected schoolId: number;

  constructor(
    protected schoolsService: SchoolsService,
    protected personsService: PersonsService
  ) {}

  setVisible(visible: boolean) {
    this.visible = visible;
  }
  public prepareNewSchool() {
    this.persons = [];
    this.image = null;
    this.schoolId = null;
    this.schoolName = new FormControl("", Validators.required);
    this.shortSchoolName = new FormControl("");
    this.alternativePictureText = new FormControl("");
    this.projectCategory = new FormControl("");
  }

  async loadNewSchool(id: number) {
    this.prepareNewSchool();
    return new Promise((resolve) => {
      this.schoolsService.getSchoolDetails(id).subscribe((result) => {
        this.schoolId = result.id;
        this.shortSchoolName.setValue(result.shortSchoolName);
        this.schoolName.setValue(result.schoolName);
        // if (result.color) {
        //   var r = parseInt(result.color.substr(0, 2), 16);
        //   var g = parseInt(result.color.substr(2, 2), 16);
        //   var b = parseInt(result.color.substr(4, 2), 16);
          // this.colorCtr.setValue(new Color(r, g, b));
        // } else {
          // this.colorCtr.setValue(new Color(255, 0, 0));
        // }
        result.personSchoolMapping.forEach((e) => {
          var personViewInstance = this.appendPersonViewDataInstance();
          personViewInstance.prefill(e);
          this.persons.push(personViewInstance);
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

  protected abstract appendPersonViewDataInstance(): AbstractPersonViewData;

  onSubmit(data) {}

  ngAfterViewInit() {}

  ngOnDestroy() {}
}
