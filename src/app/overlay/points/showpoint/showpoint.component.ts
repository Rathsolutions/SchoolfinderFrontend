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
  ViewChildren,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { PersonEntity } from "src/app/entities/PersonEntity";
import { SchoolsService } from "../../../services/schools.service";
import { PersonFunctionality } from "src/app/entities/PersonFunctionalityEntity";
import { PointOverlay } from "../pointoverlay.component";
import { PersonsService } from "src/app/services/persons.service";
import { AbstractPersonViewData } from "../../../viewdata/AbstractPersonViewData";
import { ShowPersonComponent } from "../../../viewdata/viewonly-person/showperson.component";
import * as olPixel from "ol/pixel";
import { AbstractAdditionalInformation } from "src/app/viewdata/additional-information/AbstractAdditionalInformation";
import { ShowAdditionalInformation } from "src/app/viewdata/additional-information/show/show-additional-information.component";
import { SchoolPersonEntity } from "src/app/entities/SchoolPersonEntity";

@Component({
  selector: "showpoint-component",
  templateUrl: "./showpoint.component.html",
  styleUrls: ["./showpoint.component.css"],
})
export class ShowPointOverlay
  extends PointOverlay
  implements AfterViewInit, OnDestroy
{
  currentFontRatio = 1.0;

  @ViewChild("informationOverlay", { read: ViewContainerRef })
  informationOverlay: ViewContainerRef;

  additionalInformationComponent: ComponentRef<ShowAdditionalInformation>;

  collapsedHeight = "60px";

  visible: boolean = false;

  image: string = null;

  constructor(
    protected schoolsService: SchoolsService,
    protected personsService: PersonsService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(schoolsService, null);
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }
  protected appendAdditionalInformationInstance(): ShowAdditionalInformation {
    return this.additionalInformationComponent.instance;
  }
  protected appendPersonViewDataInstance(): AbstractPersonViewData {
    var addPersonComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        ShowPersonComponent
      );
    return this.informationOverlay.createComponent(addPersonComponentFactory)
      .instance;
  }

  onSubmit(data) {}

  ngAfterViewInit() {
    var componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        ShowAdditionalInformation
      );
    this.additionalInformationComponent =
      this.informationOverlay.createComponent(componentFactory);
    // this.additionalInformationComponent.instance.prefillGeneralInformation();
  }

  async loadNewSchool(id: number): Promise<SchoolPersonEntity> {
    var entity = await super.loadNewSchool(id);
    this.additionalInformationComponent.instance.prefillGeneralInformation(
      entity
    );
    return entity;
  }

  ngOnDestroy() {}
}
