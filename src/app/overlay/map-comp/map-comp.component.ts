import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Feature, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import Draw from "ol/interaction/Draw";
import Projection from "ol/proj/Projection";
import { Vector, XYZ } from "ol/source";
import Overlay from "ol/Overlay";
import { transform, toLonLat, transformExtent } from "ol/proj";
import { UserService } from "src/app/services/user.service";
import { SchoolsService } from "src/app/services/schools.service";
import { LinearRing, Point, Polygon } from "ol/geom";
import { CriteriaEntity } from "src/app/entities/CriteriaEntity";
import { CriteriaFilterComponent } from "../filter/criteria/criteria.component";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { SchoolPersonEntity } from "src/app/entities/SchoolPersonEntity";
import VectorSource from "ol/source/Vector";
import { AddPointOverlay } from "../points/addpoint/addpointoverlay.component";
import { ShowPointOverlay } from "../points/showpoint/showpoint.component";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import {
  ZoomEventMessage,
  ZoomToEventService,
} from "src/app/broadcast-event-service/ZoomToEventService";
import GeometryType from "ol/geom/GeometryType";
import { AreaSelectionService } from "src/app/broadcast-event-service/AreaSelectionService";
import { MatDialog } from "@angular/material/dialog";
import { AreaManagementComponent } from "src/app/dialogs/area-management/area-management.component";
import { unByKey } from "ol/Observable";
import { Color } from "@angular-material-components/color-picker";

@Component({
  selector: "app-map-comp",
  templateUrl: "./map-comp.component.html",
  styleUrls: ["./map-comp.component.css"],
})
export class MapCompComponent implements OnInit {
  private map: Map;
  private mapLayer: TileLayer;
  private mapSource: XYZ;

  @ViewChild("addPointComponentOverlay", { read: ViewContainerRef })
  addPointOverlayPlaceholder: ViewContainerRef;
  addPointOverlay: AddPointOverlay;
  @ViewChild("showPointComponentOverlay", { read: ViewContainerRef })
  showPointOverlayPlaceholder: ViewContainerRef;
  @ViewChild("showPointComponentOverlay")
  showPointOverlayPlaceholderElement: ElementRef<HTMLElement>;
  @ViewChild("pointOverlayWrapper")
  pointOverlayWrapper: ElementRef<HTMLElement>;

  showPointOverlay: ShowPointOverlay;

  private existingWaypointAtGeometry: [number, number][] = [];

  @Input()
  private criteriasObject: CriteriaFilterComponent;

  sourceWaypointVector: VectorSource;

  private clickListenerRef;

  constructor(
    private schoolsService: SchoolsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private saveEventService: MapUpdateEventService,
    private zoomEventService: ZoomToEventService,
    private areaSelectionService: AreaSelectionService,
    private dialog: MatDialog
  ) {
    saveEventService.register().subscribe((res) => {
      if (res) {
        this.resetAllWaypoint();
        this.updateWaypoints();
      }
    });
    zoomEventService.register().subscribe((res) => {
      this.map
        .getView()
        .setCenter(
          transform([res.longitude, res.latitude], "EPSG:4326", "EPSG:3857")
        );
      this.map.getView().setZoom(res.zoomLevel);
    });
    areaSelectionService.registerSelectionEvent().subscribe((res) => {
      unByKey(this.clickListenerRef);
      var sourceAreaVector = new VectorSource({});
      var sourceAreaLayer = new VectorLayer({
        source: sourceAreaVector,
      });
      var draw = new Draw({
        source: sourceAreaVector,
        type: GeometryType.POLYGON,
        style: this.getDrawStyle(res.color),
      });
      if (res.area) {
        let geometry = new Polygon([res.area]);
        sourceAreaVector.addFeature(new Feature({
          geometry: geometry
        }));
      }
      draw.on("drawend", (drawEndEvent) => {
        var polygon = drawEndEvent.feature.getGeometry() as Polygon;
        res.area = polygon.getCoordinates()[0];
        this.dialog
          .open(AreaManagementComponent, {
            data: res,
          })
          .afterOpened()
          .subscribe(() => {
            this.clickListenerRef = this.map.on(
              "click",
              this.mapOnClick.bind(this)
            );
            this.map.removeLayer(sourceAreaLayer);
            this.map.removeInteraction(draw);
          });
      });
      this.map.addLayer(sourceAreaLayer);
      this.map.addInteraction(draw);
    });
    areaSelectionService.registerInstitutionEvent().subscribe((res) => {
      unByKey(this.clickListenerRef);
      var localClickEventReference = this.map.on("click", (evt) => {
        var latlong = toLonLat(evt.coordinate);
        res.areaInstitutionPosition = latlong;
        this.dialog
          .open(AreaManagementComponent, {
            data: res,
          })
          .afterOpened()
          .subscribe(() => {
            unByKey(localClickEventReference);
            this.clickListenerRef = this.map.on(
              "click",
              this.mapOnClick.bind(this)
            );
          });
      });
    });
  }

  private getDrawStyle(color: Color): Style[] {
    var colorRgb = "rgba(255,255,255,0.4)";
    if (color) {
      colorRgb = color.toRgba();
    }
    var fill = new Fill({
      color: colorRgb,
    });
    var stroke = new Stroke({
      color: "#3399CC",
      width: 1.25,
    });
    return [
      new Style({
        image: new Circle({
          fill: fill,
          stroke: stroke,
          radius: 5,
        }),
        fill: fill,
        stroke: stroke,
      }),
    ];
  }

  ngOnInit(): void {
    this.mapSource = new XYZ({
      attributions: "© Nico Rath",
      url: "https://mapserver.rathsolutions.de/styles/basic-preview/{z}/{x}/{y}.png",
    });
    this.mapLayer = new TileLayer({
      source: this.mapSource,
    });
    this.sourceWaypointVector = new VectorSource({});
    var sourceWaypointLayer = new VectorLayer({
      source: this.sourceWaypointVector,
    });
    this.map = new Map({
      layers: [this.mapLayer, sourceWaypointLayer],
      target: "map",
      view: new View({
        center: transform([8.50965, 48.85851], "EPSG:4326", "EPSG:3857"),
        zoom: 8,
      }),
    });
    this.clickListenerRef = this.map.on("click", this.mapOnClick.bind(this));
    this.map.on("moveend", this.updateWaypoints.bind(this));
  }

  public updateWaypoints(): void {
    var glbox = this.map.getView().calculateExtent(this.map.getSize());
    var zoom = this.map.getView().getZoom();
    var box = transformExtent(glbox, "EPSG:3857", "EPSG:4326");
    var replaceRegex = "/(.{5})/g,  $1\n";
    this.schoolsService
      .getSchoolsByBoundsAndCriterias(
        box[0],
        box[2],
        box[1],
        box[3],
        this.criteriasObject.selectedCriterias,
        this.criteriasObject.exclusiveSearch
      )
      .subscribe(
        (success) => {
          success.forEach((e) => {
            var waypoint = new Feature({
              geometry: new Point(
                transform([e.latitude, e.longitude], "EPSG:4326", "EPSG:3857")
              ),
            });
            var schoolNameReplaced = e.schoolName;
            var splitPoint = 0;
            if (e.schoolName.length > 5) {
              schoolNameReplaced = e.schoolName.replace(/(.{1})/g, "$1\n");
              splitPoint = schoolNameReplaced.split("\n").length;
              if (
                schoolNameReplaced.charAt(schoolNameReplaced.length - 1) == "\n"
              ) {
                schoolNameReplaced = schoolNameReplaced.substring(
                  0,
                  schoolNameReplaced.length - 1
                );
                splitPoint = splitPoint - 1;
              }
            }
            var style = this.getStyleForWaypoint(e, zoom);
            waypoint.setStyle(style);
            waypoint.setId(e.id);
            var res = this.existingWaypointAtGeometry.find(
              (element) => element[0] == e.latitude && element[1] == e.longitude
            );
            if (!res) {
              this.sourceWaypointVector.addFeature(waypoint);
              this.existingWaypointAtGeometry.push([e.latitude, e.longitude]);
            } else {
              this.sourceWaypointVector.getFeatures().forEach((element) => {
                if ((element as any).id_ == e.id) {
                  (element as any).setStyle(this.getStyleForWaypoint(e, zoom));
                }
              });
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private getStyleForWaypoint(e: SchoolPersonEntity, zoom: any) {
    var textToSet =
      zoom <= 9 && e.shortSchoolName ? e.shortSchoolName : e.schoolName;
    return new Style({
      text: new Text({
        text: textToSet,
        offsetY: -20,
        font: "bold italic " + zoom * 1.15 + "px/1.0 sans-serif",
      }),
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: e.color ? "#" + e.color : "#ff0000" }),
        stroke: new Stroke({ color: "black" }),
      }),
    });
  }

  public resetAllWaypoint(): void {
    this.sourceWaypointVector.clear();
    this.existingWaypointAtGeometry = [];
  }

  public mapOnClick(evt): void {
    const map: Map = evt.map as Map;
    const point = map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        return feature;
      },
      { hitTolerance: 3 }
    );
    var latlong = toLonLat(evt.coordinate);
    if (UserService.isLoggedIn()) {
      this.addPointOverlayPlaceholder.clear();
      var compFactoryAddPoint =
        this.componentFactoryResolver.resolveComponentFactory(AddPointOverlay);
      var component =
        this.addPointOverlayPlaceholder.createComponent(compFactoryAddPoint);
      this.addPointOverlay = component.instance;
      var overlayMap = new Overlay({
        element: this.pointOverlayWrapper.nativeElement,
        position: evt.coordinate,
      });
      if (this.showPointOverlay) {
        this.showPointOverlay.setVisible(false);
        this.showPointOverlayPlaceholder.clear();
      }
      this.map.addOverlay(overlayMap);
      this.addPointOverlay.setVisible(true);
      this.addPointOverlay.prepareNewSchool();
      if (point) {
        this.addPointOverlay.prefillByPointId((point as any).getId());
      }
    } else if (!UserService.isLoggedIn() && point) {
      this.showPointOverlayPlaceholder.clear();
      var compFactoryShowPoint =
        this.componentFactoryResolver.resolveComponentFactory(ShowPointOverlay);
      var componentShow =
        this.showPointOverlayPlaceholder.createComponent(compFactoryShowPoint);
      this.showPointOverlay = componentShow.instance;
      var overlayMap = new Overlay({
        element: this.pointOverlayWrapper.nativeElement,
        position: evt.coordinate,
      });
      this.showPointOverlay
        .loadNewSchool((point as any).getId())
        .then((res) => {
          var pixel = map.getPixelFromCoordinate(evt.coordinate);
          pixel[0] += map.getSize()[0] / 4;
          pixel[1] += map.getSize()[1] / 2.5;
          var box = map.getCoordinateFromPixel(pixel);
          this.map.getView().animate({ center: box });
        });
      this.showPointOverlay.setVisible(true);
      this.map.addOverlay(overlayMap);
    } else {
      this.showPointOverlayPlaceholder.clear();
      this.addPointOverlayPlaceholder.clear();
    }
  }
}
