//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import {
  SimpleChanges,
  ComponentFactoryResolver,
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  Injectable,
  OnInit,
} from "@angular/core";
import * as proj from "ol/proj";
import * as geom from "ol/geom";
import Map from "ol/Map";
import { Style, Text, Circle, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import { Feature } from "ol";
import { faAlignJustify, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DialogLogin } from "../../dialogs/dialogLogin.component";
import { UserService } from "../../services/user.service";
import { AddPointOverlay } from "../points/addpoint/addpointoverlay.component";
import { ShowPointOverlay } from "../points/showpoint/showpoint.component";
import { ToastrService } from "ngx-toastr";
import { SchoolsService } from "../../services/schools.service";
import { CriteriaFilterComponent } from "../filter/criteria/criteria.component";
import { SchoolPersonEntity } from "src/app/entities/SchoolPersonEntity";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { ActivatedRoute } from "@angular/router";
import { MapCompComponent } from "../map-comp/map-comp.component";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { ProjectCategoryEntity } from "src/app/entities/ProjectEntity";
@Component({
  selector: "main-component",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements AfterViewInit, OnInit {
  @ViewChild("xInput") xInput: ElementRef;
  @ViewChild("yInput") yInput: ElementRef;
  @ViewChild("filterOverlay") filterOverlay: ElementRef;
  @ViewChild("adminButton") adminButton: ElementRef;
  @ViewChild("backgroundOverlayDiv") backgroundOverlayDiv: ElementRef;
  @ViewChild("popup") popup: any;
  @ViewChild("mapComponent") mapComponent: MapCompComponent;
  @ViewChild("addPointOverlayComponent")
  addPointOverlayPlaceholder: AddPointOverlay;
  @ViewChild("showPointOverlayComponent")
  showPointOverlayPlaceholder: ShowPointOverlay;
  @ViewChild("criteriaPlaceholder", { read: ViewContainerRef })
  criteriaPlaceholder: ViewContainerRef;
  @ViewChild("criteriaFilterComponent")
  criteriasObject: CriteriaFilterComponent;
  @ViewChild("showpointOverlay") showpointOverlayOpenlayersComponent: Overlay;

  calculationInProgress: boolean = false;
  existingWaypointAtGeometry: [number, number][] = [];

  alignJustifyIcon = faAlignJustify;
  usersCog = faUserCog;
  overlayVisible: boolean;
  adminOverlayVisible: boolean;
  adminButtonColor: string = "primary";
  projectParam: number;
  projectInstance: ProjectCategoryEntity;
  disabledButtons: boolean = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
    private schoolsService: SchoolsService,
    private projectCategoryService: ProjectCategoryService,
    private toastr: ToastrService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private calculationEventService: CalculationEventService,
    private route: ActivatedRoute
  ) {
    calculationEventService.register().subscribe((res) => {
      this.setCalculationInProgress(res);
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      console.log(params.get("projectId"));
      var projectParam = params.get("projectId");
      console.log(projectParam);
      if (projectParam) {
        this.projectParam = parseInt(projectParam);
        this.projectCategoryService.read(this.projectParam).subscribe(res => {
          this.projectInstance = res;
        });
      }
    });
  }
  disableButtonsEvent(val: boolean) {
    this.disabledButtons = val;
    console.log(this.disabledButtons);
  }
  ngAfterViewInit(): void { }

  public toggleAdminMode() {
    if (UserService.isLoggedIn()) {
      this.userService.logout();
      this.adminButtonColor = "primary";
      this.toastr.success("Erfolgreich abgemeldet!");
      return;
    }
    const dialog = this.dialog.open(DialogLogin, {
      width: "250px",
      data: { username: "", password: "" },
    });
    dialog.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.userService.login(result.username, result.password).subscribe(
        (success) => {
          this.adminButtonColor = "warn";
          this.toastr.success(
            "Erfolgreicher Login! Willkommen, " + result.username,
            "Erfolg"
          );
        },
        (error) => {
          if (error.status === 401) {
            this.toastr.error(
              "Die Zugangsdaten sind leider invalide!",
              "Error"
            );
          } else {
            this.toastr.error(
              "Ein Problem ist aufgetreten! Bitte kontaktieren Sie den Serveradministrator",
              "Error"
            );
          }
        }
      );
    });
  }

  public toggleOverlay(): void {
    if (this.filterOverlay.nativeElement.classList.contains("selected")) {
      this.filterOverlay.nativeElement.classList.remove("selected");
      this.filterOverlay.nativeElement.classList.add("dismiss");
      this.backgroundOverlayDiv.nativeElement.classList.remove(
        "fadeInBackground"
      );
      this.backgroundOverlayDiv.nativeElement.classList.add(
        "fadeOutBackground"
      );
      this.adminButton.nativeElement.classList.remove("fadeInAdminButton");
      this.adminButton.nativeElement.classList.add("fadeOutAdminButton");
    } else {
      this.filterOverlay.nativeElement.classList.remove("dismiss");
      this.filterOverlay.nativeElement.classList.add("selected");
      this.backgroundOverlayDiv.nativeElement.classList.add("fadeInBackground");
      this.backgroundOverlayDiv.nativeElement.classList.remove(
        "fadeOutBackground"
      );
      this.adminButton.nativeElement.classList.add("fadeInAdminButton");
      this.adminButton.nativeElement.classList.remove("fadeOutAdminButton");
    }
  }

  public setCalculationInProgress(val: boolean): void {
    this.calculationInProgress = val;
  }
}
