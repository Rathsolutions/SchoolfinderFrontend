//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { SimpleChanges, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, ElementRef, AfterViewInit, Injectable } from '@angular/core';
import { MapComponent, SourceComponent, SourceVectorTileComponent, ViewComponent, CoordinateComponent, OverlayComponent, SourceVectorComponent, FeatureComponent } from 'ngx-openlayers';
import * as proj from 'ol/proj';
import * as geom from 'ol/geom';
import Map from 'ol/Map';
import { Style, Text, Circle, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import { Feature } from 'ol';
import { faAlignJustify, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogLogin } from '../../dialogs/dialogLogin.component';
import { UserService } from '../../services/user.service';
import { AddPointOverlay } from '../points/addpoint/addpointoverlay.component';
import { ShowPointOverlay } from '../points/showpoint/showpoint.component';
import { ToastrService } from 'ngx-toastr';
import { SchoolsService } from '../../services/schools.service';
import { CriteriaFilterComponent } from '../filter/criteria/criteria.component';

@Component({
    selector: 'main-component',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})

export class MainComponent implements AfterViewInit {
    @ViewChild('xInput') xInput: ElementRef;
    @ViewChild('yInput') yInput: ElementRef;
    @ViewChild('filterOverlay') filterOverlay: ElementRef;
    @ViewChild('adminButton') adminButton: ElementRef;
    @ViewChild('backgroundOverlayDiv') backgroundOverlayDiv: ElementRef;
    @ViewChild('popup') popup: any;
    @ViewChild('mapCoord') map: CoordinateComponent;
    @ViewChild('map') mapComp: MapComponent;
    @ViewChild('mapView') mapView: ViewComponent;
    @ViewChild('sourceLayer') sourceLayer: SourceComponent;
    @ViewChild('sourceWaypointVector') sourceWaypointVector: SourceVectorTileComponent;
    @ViewChild('addPointOverlayComponent') addPointOverlayPlaceholder: AddPointOverlay;
    @ViewChild('showPointOverlayComponent') showPointOverlayPlaceholder: ShowPointOverlay;
    @ViewChild('criteriaPlaceholder', { read: ViewContainerRef }) criteriaPlaceholder: ViewContainerRef;
    @ViewChild('criteriaFilterComponent') criteriasObject: CriteriaFilterComponent;
    @ViewChild('showpointOverlay') showpointOverlayOpenlayersComponent: Overlay


    calculationInProgress: boolean = false;
    lat: number;
    long: number
    infoboxLat: number;
    infoboxLong: number;
    addPointOverlayLat: number;
    addPointOverlayLong: number;
    mapObject: any;
    existingWaypointAtGeometry: [number, number][] = [];

    alignJustifyIcon = faAlignJustify;
    usersCog = faUserCog;
    filterForm;
    overlayVisible: boolean;
    adminOverlayVisible: boolean;
    adminButtonColor: string = "primary";

    constructor(private resolver: ComponentFactoryResolver, private formBuilder: FormBuilder, private dialog: MatDialog, private userService: UserService, private schoolsService: SchoolsService, private toastr: ToastrService, private componentFactoryResolver: ComponentFactoryResolver) {
        this.lat = 8.50965;
        this.long = 48.85851;
    }

    ngAfterViewInit(): void {
        this.mapComp.singleClick.subscribe((e => {
            this.mapOnClick(e);
        }));
        this.mapComp.onpostrender.subscribe(e => {
            this.mapObject = e.map;
        });
        this.mapComp.instance.on('moveend', () => {
            this.updateWaypoints();
        });
        this.criteriasObject.mainAppComponent = this;
    }

    public zoomTo(lat: number, long: number, zoomVal: number): void {
        var transformed = proj.transform([lat, long], 'EPSG:4326', 'EPSG:3857');
        console.log(transformed);
        this.map.x = long;
        this.map.y = lat;
        this.mapView.instance.setZoom(zoomVal);
        this.map.ngOnChanges(null);
    }

    public resetAllWaypoint(): void {
        this.sourceWaypointVector.instance.clear();
        this.existingWaypointAtGeometry = [];
    }

    public updateWaypoints(): void {
        var glbox = this.mapObject.getView().calculateExtent(this.mapObject.getSize());
        var box = proj.transformExtent(glbox, 'EPSG:3857', 'EPSG:4326');
        var replaceRegex = "/(.{5})/g,  $1\n";
        this.schoolsService.getSchoolsByBoundsAndCriterias(box[0], box[2], box[1], box[3], this.criteriasObject.selectedCriterias, this.criteriasObject.exclusiveSearch).subscribe(success => {
            success.forEach(e => {
                var waypoint = new Feature({
                    geometry: new geom.Point(proj.transform([e.latitude, e.longitude], 'EPSG:4326', 'EPSG:3857'))
                });
                var schoolNameReplaced = e.schoolName;
                var splitPoint = 0;
                if (e.schoolName.length > 5) {
                    schoolNameReplaced = e.schoolName.replace(/(.{1})/g, "$1\n");
                    splitPoint = schoolNameReplaced.split("\n").length;
                    if (schoolNameReplaced.charAt(schoolNameReplaced.length - 1) == '\n') {
                        schoolNameReplaced = schoolNameReplaced.substring(0, schoolNameReplaced.length - 1);
                        splitPoint = splitPoint - 1;
                    }
                }
                // var p = splitPoint % 2 == 0 ? ; 
                // var offset = (-20 - (Math.pow(splitPoint+1,1.8)));
                // console.log(offset);
                // console.log(schoolNameReplaced + "len:" + splitPoint)
                var style = new Style({
                    text: new Text({
                        text: e.schoolName,
                        offsetY: -20,
                        font: 'bold italic 14px/1.0 sans-serif',
                    }),
                    image: new Circle({
                        radius: 6,
                        fill: new Fill({ color: e.color ? "#" + e.color : '#ff0000' }),
                        stroke: new Stroke({ color: 'black' })
                    })
                });
                waypoint.setStyle(style);
                waypoint.setId(e.id);
                var res = this.existingWaypointAtGeometry.find(element => element[0] == e.latitude && element[1] == e.longitude);
                if (!res) {
                    this.sourceWaypointVector.instance.addFeature(waypoint);
                    this.existingWaypointAtGeometry.push([e.latitude, e.longitude]);
                }
            });
        }, error => {
            console.log(error);
        });
    }

    public toggleAdminMode() {
        if (UserService.isLoggedIn()) {
            this.userService.logout();
            this.adminButtonColor = "primary";
            this.toastr.success("Erfolgreich abgemeldet!");
            return;
        }
        const dialog = this.dialog.open(DialogLogin, {
            width: '250px',
            data: { username: '', password: '' }
        });
        dialog.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            this.userService.login(result.username, result.password).subscribe(success => {
                this.adminButtonColor = "warn";
                this.toastr.success("Erfolgreicher Login! Willkommen, " + result.username, "Erfolg");
            }, error => {
                if (error.status === 401) {
                    this.toastr.error("Die Zugangsdaten sind leider invalide!", "Error");
                } else {
                    this.toastr.error("Ein Problem ist aufgetreten! Bitte kontaktieren Sie den Serveradministrator", "Error");
                }
            });
        });
    }

    public toggleOverlay(): void {
        if (this.filterOverlay.nativeElement.classList.contains('selected')) {
            this.filterOverlay.nativeElement.classList.remove('selected');
            this.filterOverlay.nativeElement.classList.add('dismiss');
            this.backgroundOverlayDiv.nativeElement.classList.remove('fadeInBackground');
            this.backgroundOverlayDiv.nativeElement.classList.add('fadeOutBackground');
            this.adminButton.nativeElement.classList.remove('fadeInAdminButton');
            this.adminButton.nativeElement.classList.add('fadeOutAdminButton');
        } else {
            this.filterOverlay.nativeElement.classList.remove('dismiss');
            this.filterOverlay.nativeElement.classList.add('selected');
            this.backgroundOverlayDiv.nativeElement.classList.add('fadeInBackground');
            this.backgroundOverlayDiv.nativeElement.classList.remove('fadeOutBackground');
            this.adminButton.nativeElement.classList.add('fadeInAdminButton');
            this.adminButton.nativeElement.classList.remove('fadeOutAdminButton');
        }
    }

    public mapOnClick(evt): void {
        const map: Map = evt.map as Map;
        const point = map.forEachFeatureAtPixel(evt.pixel,
            function (feature, layer) {
                return feature;
            }, { hitTolerance: 3 });
        var latlong = proj.toLonLat(evt.coordinate);
        if (UserService.isLoggedIn()) {
            this.addPointOverlayPlaceholder.prepareNewSchool();
            if (point) {
                this.addPointOverlayPlaceholder.prefillByPointId(point.getId());
            }
            this.addPointOverlayLat = latlong[0];
            this.addPointOverlayLong = latlong[1];
            this.adminOverlayVisible = true;
            this.overlayVisible = false;
            this.showPointOverlayPlaceholder.setVisible(false);
            this.addPointOverlayPlaceholder.setLat(this.addPointOverlayLat);
            this.addPointOverlayPlaceholder.setLong(this.addPointOverlayLong);
            this.addPointOverlayPlaceholder.setVisible(true);
        } else if (!UserService.isLoggedIn() && point) {
            this.infoboxLat = latlong[0];
            this.infoboxLong = latlong[1];
            this.overlayVisible = true;
            this.showPointOverlayPlaceholder.loadNewSchool(point.getId()).then(res => {
                var zoom = map.getView().getZoom();
                var pixel = map.getPixelFromCoordinate(evt.coordinate);
                pixel[0] += 130;
                pixel[1] += 300;
                var box = map.getCoordinateFromPixel(pixel);
                console.log(box);
                this.mapView.instance.animate({ center: box });
            });
            this.showPointOverlayPlaceholder.setVisible(true);
        } else {
            this.overlayVisible = false;
        }
    }

    public setCalculationInProgress(val: boolean): void {
        this.calculationInProgress = val;
    }
}
