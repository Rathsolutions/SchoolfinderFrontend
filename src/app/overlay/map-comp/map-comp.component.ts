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
import { Attribution, MousePosition, OverviewMap } from "ol/control";
import { Feature, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import Draw from "ol/interaction/Draw";
import Projection from "ol/proj/Projection";
import { TileJSON, Vector, XYZ } from "ol/source";
import Overlay from "ol/Overlay";
import { transform, toLonLat, transformExtent } from "ol/proj";
import { UserService } from "src/app/services/user.service";
import { SchoolsService } from "src/app/services/schools.service";
import { LinearRing, Point, Polygon } from "ol/geom";
import { CriteriaFilterComponent } from "../filter/criteria/criteria.component";
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
import {
  AreaManagementComponent,
  AreaManagementData,
} from "src/app/dialogs/area-management/area-management.component";
import { unByKey } from "ol/Observable";
import { Color } from "@angular-material-components/color-picker";
import { AreaService } from "src/app/services/area.service";
import { Coordinate } from "ol/coordinate";
import { Position } from "src/app/entities/Position";
import { ColorParser } from "src/app/util/color-parser";
import { AreaEntity } from "src/app/entities/AreaEntity";
import { Styles } from "src/app/util/styles";
import { FeatureFactory } from "src/app/util/FeatureFactory";
import { AreaShowEventStrategy } from "src/app/broadcast-event-service/visibility-event-strategies/AreaShowEventStrategy";
import { VisibilityEventService } from "src/app/broadcast-event-service/VisibilityEventService";
import { VisibilityDataElement } from "src/app/broadcast-event-service/visibility-event-strategies/VisibilityEventStrategy";
import { ProjectCategoryEntity } from "src/app/entities/ProjectEntity";
import olms from "ol-mapbox-style";
import stylefunction from "ol-mapbox-style/dist/stylefunction";
import GeoJSON from "ol/format/GeoJSON";

@Component({
  selector: "app-map-comp",
  templateUrl: "./map-comp.component.html",
  styleUrls: ["./map-comp.component.css"],
})
export class MapCompComponent implements OnInit {
  private map: Map;
  private mapLayer: TileLayer<any>;
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

  private drawInstance: Draw;
  private existingWaypointAtGeometry: [number, number][] = [];

  @Input()
  private criteriasObject: CriteriaFilterComponent;

  @Input()
  private projectParam: ProjectCategoryEntity;

  sourceWaypointVector: VectorSource<any>;
  sourceAreaLayer: VectorLayer<any>;
  sourceWaypointLayer: VectorLayer<any>;
  private clickListenerRef;
  private visibilityDataElement = new VisibilityDataElement();
  areaSelectionActive: boolean = false;
  institutionSelectionActive: boolean = false;

  currentAreaEventData: AreaManagementData;
  sourceAreaVector: VectorSource<any>;

  constructor(
    private schoolsService: SchoolsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private saveEventService: MapUpdateEventService,
    private zoomEventService: ZoomToEventService,
    private areaSelectionService: AreaSelectionService,
    private areaService: AreaService,
    private dialog: MatDialog,
    private visiblityEventService: VisibilityEventService
  ) {
    this.visibilityDataElement.activeAreaStrategy = new AreaShowEventStrategy(
      this.areaService
    );
    visiblityEventService.register().subscribe((res) => {
      res.performActionOnLayer(
        this.sourceAreaVector,
        this.map,
        this.visibilityDataElement
      );
    });
    saveEventService.register().subscribe((res) => {
      if (res) {
        this.resetAllWaypoint();
        this.updateWaypoints();
        this.visibilityDataElement.activeAreaStrategy.performActionOnLayer(
          this.sourceAreaVector,
          this.map,
          this.visibilityDataElement
        );
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
      this.currentAreaEventData = res;
      this.areaSelectionActive = true;
      unByKey(this.clickListenerRef);
      this.drawInstance = new Draw({
        source: this.sourceAreaVector,
        type: GeometryType.POLYGON,
        style: Styles.getDrawStyle(res.color),
      });
      this.sourceAreaVector.getFeatures().forEach((e) => {
        if (e.getId() == res.id) {
          this.sourceAreaVector.removeFeature(e);
        }
      });
      this.map.addInteraction(this.drawInstance);
      if (res.area) {
        var polygonAreaToAdd = [];
        for (let i = 0; i < res.area.length - 1; i++) {
          polygonAreaToAdd.push(res.area[i]);
        }
        let geometry = new Polygon([polygonAreaToAdd]);
        var polygon = new Feature({
          geometry: geometry,
        });
        geometry.getCoordinates().forEach((e) => {
          this.drawInstance.appendCoordinates(e);
        });
      }
      this.drawInstance.on("drawend", (drawEndEvent) => {
        var polygon = drawEndEvent.feature.getGeometry() as Polygon;
        res.area = polygon.getCoordinates()[0];
        this.finalizeDrawing(res);
        this.currentAreaEventData = null;
      });
    });
    areaSelectionService.registerInstitutionEvent().subscribe((res) => {
      this.currentAreaEventData = res;
      this.institutionSelectionActive = true;
      unByKey(this.clickListenerRef);
      this.drawInstance = new Draw({
        source: this.sourceAreaVector,
        type: GeometryType.POINT,
      });
      this.drawInstance.on("drawend", (drawEndEvent) => {
        var point: Point = drawEndEvent.feature.getGeometry() as Point;
        this.sourceAreaVector.getFeatures().forEach((e) => {
          if (e.getId() == res.id + FeatureFactory.POINT) {
            this.sourceAreaVector.removeFeature(e);
          }
        });

        var latlong = toLonLat(point.getCoordinates());
        console.log(latlong);
        res.areaInstitutionPosition = latlong;
        var pos = new Position();
        pos.latitude = latlong[0];
        pos.latitude = latlong[1];
        var institutionFeature = FeatureFactory.createInstitutionFeature(
          res.id,
          res.name,
          pos,
          this.map.getView().getZoom()
        );
        this.sourceAreaVector.addFeature(institutionFeature);
        this.finalizeDrawing(res);
      });
      this.map.addInteraction(this.drawInstance);
    });
  }

  private finalizeDrawing(res: AreaManagementData): void {
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
        this.visibilityDataElement.activeAreaStrategy.performActionOnLayer(
          this.sourceAreaVector,
          this.map,
          this.visibilityDataElement
        );
        this.map.removeInteraction(this.drawInstance);
        this.areaSelectionActive = false;
        this.institutionSelectionActive = false;
      });
  }

  public abortDrawing(): void {
    this.drawInstance.abortDrawing();
    this.finalizeDrawing(this.currentAreaEventData);
    this.currentAreaEventData = null;
  }

  //TODO repair method
  public applyDrawing(): void {
    var polygon = this.drawInstance
      .getOverlay()
      .getSource()
      .getFeatures()[0]
      .getGeometry() as Polygon;
    this.currentAreaEventData.area = [];
    for (let i = 0; i < polygon.getCoordinates()[0].length; i++) {
      if (i != polygon.getCoordinates()[0].length - 2) {
        this.currentAreaEventData.area.push(polygon.getCoordinates()[0][i]);
      }
    }
    // this.currentAreaEventData.area.push(polygon.getCoordinates()[0][0]);
    this.finalizeDrawing(this.currentAreaEventData);
    this.currentAreaEventData = null;
  }

  public removeLastSetDrawingPoint(): void {
    this.drawInstance.removeLastPoint();
  }

  ngOnInit(): void {
    this.mapSource = new XYZ({
      attributions:
        '© <a href=https://rathsolutions.de target="_blank">Nico Rath</a>, <a href="http://www.openstreetmaps.org/" target="_blank">OpenStreetMaps</a>, <a href="https://openlayers.org/" target="_blank">OpenLayers</a>',
      url: "https://mapserver.rathsolutions.de/styles/liberty/{z}/{x}/{y}.png",
    });
    this.mapLayer = new TileLayer({
      source: this.mapSource,
    });
    this.sourceAreaVector = new VectorSource({});
    this.sourceWaypointVector = new VectorSource({});
    this.sourceWaypointLayer = new VectorLayer({
      source: this.sourceWaypointVector,
    });

    this.sourceAreaLayer = new VectorLayer({
      source: this.sourceAreaVector,
    });
    this.map = new Map({
      // layers: [this.sourceAreaLayer, sourceWaypointLayer],
      target: "map",
      view: new View({
        center: transform([8.50965, 48.65851], "EPSG:4326", "EPSG:3857"),
        zoom: 8,
        minZoom: 8,
      }),
      controls: [],
    });
    this.map.addControl(new Attribution());
    this.clickListenerRef = this.map.on("click", this.mapOnClick.bind(this));
    this.map.on("moveend", () => {
      this.updateWaypoints();
      // this.visibilityDataElement.activeAreaStrategy.performActionOnLayer(
      //   this.sourceAreaVector,
      //   this.map,
      //   this.visibilityDataElement
      // );
    });
    this.visibilityDataElement.activeAreaStrategy.performActionOnLayer(
      this.sourceAreaVector,
      this.map,
      this.visibilityDataElement
    );
    this.map.addLayer(this.mapLayer);
    this.map.addLayer(this.sourceAreaLayer);
    this.map.addLayer(this.sourceWaypointLayer);
    // olms(this.map, "https://mapserver.rathsolutions.de/styles/liberty/style.json").then((res) => {

    // });
  }

  public updateWaypoints(): void {
    var glbox = this.map.getView().calculateExtent(this.map.getSize());
    var zoom = this.map.getView().getZoom();
    var box = transformExtent(glbox, "EPSG:3857", "EPSG:4326");
    var replaceRegex = "/(.{5})/g,  $1\n";
    this.schoolsService
      .getSchoolsByBoundsAndCriteriasAndProject(
        box[0],
        box[2],
        box[1],
        box[3],
        this.projectParam,
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
            var style = Styles.getStyleForWaypoint(e, zoom, this.projectParam);
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
                  (element as any).setStyle(
                    Styles.getStyleForWaypoint(e, zoom, this.projectParam)
                  );
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

  public resetAllWaypoint(): void {
    this.sourceWaypointVector.clear();
    this.existingWaypointAtGeometry = [];
  }

  public mapOnClick(evt): void {
    const map: Map = evt.map as Map;
    var sourceVectorLayerBound = this.sourceWaypointLayer;
    const point = map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        if (sourceVectorLayerBound != layer) {
          return undefined;
        }
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
      this.addPointOverlay.init().then((res) => {
        this.addPointOverlay.setLat(latlong[0]);
        this.addPointOverlay.setLong(latlong[1]);
        this.addPointOverlay.prepareNewSchool();
        this.addPointOverlay.setVisible(true);
        if (point) {
          this.addPointOverlay.prefillByPointId((point as any).getId());
        }
      });
    } else if (!UserService.isLoggedIn() && point && point.getId()) {
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
          // this.map.getView().fit(box,{
          //   duration: 1000
          // });
          this.map.getView().animate({ center: box }, () => {
            // this.map.getView().setCenter(box);
          });
        });
      this.showPointOverlay.setVisible(true);
      this.map.addOverlay(overlayMap);
    } else {
      this.showPointOverlayPlaceholder.clear();
      this.addPointOverlayPlaceholder.clear();
    }
  }
}
