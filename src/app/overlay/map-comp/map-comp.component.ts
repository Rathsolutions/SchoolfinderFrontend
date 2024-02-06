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
import * as OsmMap from "ol/Map";
import Draw from "ol/interaction/Draw";
import Projection from "ol/proj/Projection";
import { Cluster, TileJSON, Vector, XYZ } from "ol/source";
import Overlay from "ol/Overlay";
import { transform, toLonLat, transformExtent } from "ol/proj";
import { UserService } from "src/app/services/user.service";
import { SchoolsService } from "src/app/services/schools.service";
import { LinearRing, MultiPolygon, Point, Polygon } from "ol/geom";
import { CriteriaFilterComponent } from "../filter/criteria/criteria.component";
import VectorSource from "ol/source/Vector";
import { AddPointOverlay } from "../points/addpoint/addpointoverlay.component";
import { ShowPointOverlay } from "../points/showpoint/showpoint.component";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import {
  ZoomEventMessage,
  ZoomToEventService,
} from "src/app/broadcast-event-service/ZoomToEventService";


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
import { Image, Style, Text } from "ol/style";
import { SchoolsDao } from "src/app/services/dao/schools.dao";
import { Extent, boundingExtent, containsCoordinate, containsExtent } from "ol/extent";
import { ToastrService } from "ngx-toastr";
import BaseEvent from "ol/events/Event";
import { EventTargetLike } from "ol/events/Target";
import { DarkenLayer } from "./layer/darken-layer";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { SelectionDialogViewData } from "src/app/viewdata/SelectionDialogViewData";
import { SearchSelectionComponent } from "src/app/dialogs/searchSelection.component";

@Component({
  selector: "app-map-comp",
  templateUrl: "./map-comp.component.html",
  styleUrls: ["./map-comp.component.css"],
})
export class MapCompComponent implements OnInit {
  private map: OsmMap.default;
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

  zoomBeforeMove: number;

  showPointOverlay: ShowPointOverlay;

  private drawInstance: Draw;
  private existingWaypointAtGeometry: [number, number][] = [];

  @Input()
  private criteriasObject: CriteriaFilterComponent;

  @Input()
  private projectParam: ProjectCategoryEntity;

  @Input()
  private projectParamId: number;

  // sourceWaypointImageVector: VectorSource<any>;
  sourceWaypointVector: VectorSource<any>;
  sourceAreaImageLayer: VectorLayer<any>;
  sourceAreaTextLayer: VectorLayer<any>;
  // sourceWaypointImageLayer: VectorLayer<any>;
  private clickListenerRef;
  private visibilityDataElement = new VisibilityDataElement();
  private darkenLayer: DarkenLayer;
  areaSelectionActive: boolean = false;
  institutionSelectionActive: boolean = false;

  currentAreaEventData: AreaManagementData;
  sourceAreaImageVector: VectorSource<any>;
  sourceAreaTextVector: VectorSource<any>;
  sourceWaypointLayer: VectorLayer<Vector<any>>;

  constructor(
    private schoolsDao: SchoolsDao,
    private componentFactoryResolver: ComponentFactoryResolver,
    private calculationEventService: CalculationEventService,
    private schoolService: SchoolsService,
    saveEventService: MapUpdateEventService,
    private zoomEventService: ZoomToEventService,
    private areaSelectionService: AreaSelectionService,
    private toastrService: ToastrService,
    private areaService: AreaService,
    private dialog: MatDialog,
    visiblityEventService: VisibilityEventService
  ) {
    this.darkenLayer = new DarkenLayer(areaService, this);
    this.visibilityDataElement.activeAreaStrategy = new AreaShowEventStrategy(
      this.areaService
    );
    visiblityEventService.register().subscribe((res) => {
      res.performActionOnLayer(
        this.sourceAreaImageVector,
        this.sourceAreaTextVector,
        [this.darkenLayer],
        this.map,
        this.visibilityDataElement
      );
    });
    saveEventService.register().subscribe((res) => {
      if (res) {
        this.resetAllWaypoint();
        this.updateWaypoints();
        this.visibilityDataElement.activeAreaStrategy.performActionOnLayer(
          this.sourceAreaImageVector,
          this.sourceAreaTextVector,
          [this.darkenLayer],
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
        source: this.sourceAreaImageVector,
        type: 'Polygon',
        style: Styles.getDrawStyle(res.color),
      });
      this.sourceAreaImageVector.getFeatures().forEach((e) => {
        if (e.getId() == res.id) {
          this.sourceAreaImageVector.removeFeature(e);
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
        source: this.sourceAreaTextVector,
        type: 'Point',
      });
      this.drawInstance.on("drawend", (drawEndEvent) => {
        var point: Point = drawEndEvent.feature.getGeometry() as Point;
        this.sourceAreaTextVector.getFeatures().forEach((e) => {
          if (e.getId() == res.id + FeatureFactory.POINT) {
            this.sourceAreaTextVector.removeFeature(e);
          }
        });

        var latlong = toLonLat(point.getCoordinates());
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
        this.sourceAreaTextVector.addFeature(institutionFeature);
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
          this.sourceAreaImageVector,
          this.sourceAreaTextVector,
          [this.darkenLayer],
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
        '© <a href=https://rathsolutions.de target="_blank">Nico Rath</a>, <a href="http://www.openstreetmaps.org/" target="_blank">OpenStreetMap Contributors</a>',
      url: "https://mapserver.rathsolutions.de/styles/liberty/{z}/{x}/{y}.png",
    });
    this.mapLayer = new TileLayer({
      source: this.mapSource,
    });
    this.sourceAreaImageVector = new VectorSource({});
    this.sourceAreaTextVector = new VectorSource({});
    this.sourceWaypointVector = new VectorSource({});
    const clusterSource = new Cluster({
      distance: 100,
      source: this.sourceWaypointVector,

    });
    // const imageClusterSource = new Cluster({
    //   source: this.sourceWaypointImageVector
    // });
    // this.sourceWaypointImageLayer = new VectorLayer({
    //   style: this.styleFunctionImage,
    //   source: imageClusterSource,
    //   // declutter: true
    // });
    this.sourceWaypointLayer = new VectorLayer({
      source: clusterSource,
      style: this.styleFunctionText.bind(this),
    });
    this.sourceAreaImageLayer = new VectorLayer({
      source: this.sourceAreaImageVector,
    });
    this.sourceAreaTextLayer = new VectorLayer({
      source: this.sourceAreaTextVector,
      // declutter: true,
    });
    this.map = new OsmMap.default({
      target: "map",
      view: new View({
        center: transform([8.50965, 48.65851], "EPSG:4326", "EPSG:3857"),
        zoom: 9,
        minZoom: 8,
      }),
      controls: [],
    });
    this.map.addControl(new Attribution());
    this.clickListenerRef = this.map.on("click", this.mapOnClick.bind(this));
    this.map.on("movestart", () => {
      this.zoomBeforeMove = this.map.getView().getZoom();
    });
    this.map.on("pointermove", function (evt) {
      var hit = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        var clusteredFeatures = feature.get("features");
        return clusteredFeatures && clusteredFeatures.length == 1;
      }, { hitTolerance: 3, layerFilter: this.sourceWaypointLayer });
      if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
      } else {
        this.getTargetElement().style.cursor = '';
      }
    });
    this.map.on("moveend", () => {
      this.updateWaypoints();
    });
    this.visibilityDataElement.activeAreaStrategy.performActionOnLayer(
      this.sourceAreaImageVector,
      this.sourceAreaTextVector,
      [this.darkenLayer],
      this.map,
      this.visibilityDataElement
    );
    this.mapLayer.setZIndex(1);
    this.sourceAreaImageLayer.setZIndex(2);
    this.sourceWaypointLayer.setZIndex(4);
    // this.sourceWaypointTextLayer.setZIndex(4);
    this.sourceAreaTextLayer.setZIndex(5);
    this.map.addLayer(this.mapLayer);
    this.map.addLayer(this.sourceAreaImageLayer);
    this.darkenLayer.addToMap(this.map);
    this.map.addLayer(this.sourceWaypointLayer);
    // this.map.addLayer(this.sourceWaypointTextLayer);
    this.map.addLayer(this.sourceAreaTextLayer);

  }

  private styleFunctionImage(feature, resolution) {
    const originalFeature = feature.get("features");
    if (feature.get("features").length == 1) {
      return originalFeature[0].style_;
    } else {
      return originalFeature[0].style_;
    }
  }


  private styleFunctionText(feature, resolution) {
    const originalFeature = feature.get("features");
    // var hasOverlap = this.map.forEachFeatureAtPixel(this.map.getPixelFromCoordinate(feature.get("geometry").flatCoordinates), (featureAtThere) => {
    //   return true;
    // }, { hitTolerance: 10, layerFilter: (layer) => this.sourceAreaTextLayer == layer });
    // if (hasOverlap) {
    //   return new Style({
    //     image: (originalFeature[0].style_ as Style).getImage(),
    //   });
    // }
    if (feature.get("features").length == 1) {
      return originalFeature[0].style_;
    } else {
      var countMap = new Map<string, number>();
      var imageMap = new Map<string, Image>();
      (originalFeature as Feature[]).forEach(feature => {
        var imgBase = (((feature.getStyle() as Style).getImage()) as any)["iconImage_"]["src_"] as string;
        var key = imgBase;
        if (countMap.has(imgBase)) {
          countMap.set(key, countMap.get(key) + 1);
        } else {
          countMap.set(key, 1);
          imageMap.set(key, ((feature.getStyle() as Style).getImage()));
        }
      });
      var foundKey: string;
      var foundAmount: number = 0;
      for (var entry of countMap.entries()) {
        if (foundAmount < entry[1]) {
          foundAmount = entry[1];
          foundKey = entry[0];
        }
      }
      return new Style({
        image: imageMap.get(foundKey),
        text: Styles.createTextStyleForWaypoint({ r: 0, g: 0, b: 0 }, "Institutionen: " + originalFeature.length, 10)
      });
    }
  }

  public showAllInstitutions(): void {
    this.calculationEventService.emit(true);
    var foundOsmEntity = this.schoolService
      .getAllSchoolsOrderedByName()
      .subscribe(
        (result) => {
          var dialogViewdata: SelectionDialogViewData[] = [];
          result.forEach((e) => {
            var subtitle = "Für weitere Informationen klicken";
            if (subtitle.length > 0) {
              subtitle = "";
              e.personSchoolMapping.forEach((mapping) => {
                subtitle += mapping.functionality.name + " & ";
              });
              subtitle = subtitle.substring(0, subtitle.length - 3);
            }
            //Seems like latlong are swapped for schools. be careful when fixing this
            dialogViewdata.push(
              new SelectionDialogViewData(
                e.schoolName,
                subtitle,
                e.longitude,
                e.latitude
              )
            );
          });
          this.showSelectDialog(
            dialogViewdata,
            "Alle eingetragenen Institutionen",
            "Bitte wählen Sie die gesuchte Institution aus"
          );
        },
        (err) => this.errorOnRequest(err)
      );
  }

  private showSelectDialog(result, headline: string, underline: string) {
    const dialog = this.dialog.open(SearchSelectionComponent, {
      panelClass: "searchSelectionComponent",
      data: { cardData: result, headline: headline, underheadline: underline },
    });
    dialog.afterClosed().subscribe((result) => {
      this.renderNewPositionInMainApp(result);
    });
  }
  private renderNewPositionInMainApp(result: SelectionDialogViewData) {
    this.calculationEventService.emit(false);
    this.zoomEventService.emit(
      new ZoomEventMessage(result.getLatitude(), result.getLongitude(), 17)
    );
  }
  private errorOnRequest(err) {
    this.calculationEventService.emit(false);
    this.toastrService.error(
      "Es ist ein Fehler aufgetreten! Bitte kontaktieren Sie den Betreiber"
    );
  }
  public updateWaypoints(): void {
    var glbox = this.map.getView().calculateExtent(this.map.getSize());
    var zoom = this.map.getView().getZoom();
    var box = transformExtent(glbox, "EPSG:3857", "EPSG:4326");
    var replaceRegex = "/(.{5})/g,  $1\n";
    this.schoolsDao
      .getSchoolsByBoundsAndCriteriasAndSchoolTypesAndProject(
        box[0],
        box[2],
        box[1],
        box[3],
        this.projectParamId,
        this.criteriasObject.selectedCriterias,
        this.criteriasObject.selectedSchoolTypes,
        this.criteriasObject.exclusiveSearch
      ).then(promise =>
        promise.subscribe(
          (success) => {
            success.forEach((e) => {

              var waypoint = new Feature({
                geometry: new Point(
                  transform([e.latitude, e.longitude], "EPSG:4326", "EPSG:3857")
                ),
              });
              // var waypointText = new Feature({
              //   geometry: new Point(
              //     transform([e.latitude, e.longitude], "EPSG:4326", "EPSG:3857")
              //   ),
              // });
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

              waypoint.setStyle(
                Styles.getCombinedStyleForWaypoint(e, zoom, this.projectParam)
              );
              waypoint.setId(e.id);
              // waypointText.setStyle(
              //   Styles.getTextStyleForWaypoint(e, zoom, this.projectParam)
              // );
              // waypointText.setId(e.id);
              var res = this.existingWaypointAtGeometry.find(
                (element) => element[0] == e.latitude && element[1] == e.longitude
              );
              if (!res) {
                this.sourceWaypointVector.addFeature(waypoint);
                // this.sourceWaypointTextVector.addFeature(waypointText);
                this.existingWaypointAtGeometry.push([e.latitude, e.longitude]);
              } else {
                this.sourceWaypointVector
                  .getFeatures()
                  .forEach((element) => {
                    if ((element as any).id_ == e.id) {
                      (element as any).setStyle(
                        Styles.getCombinedStyleForWaypoint(
                          e,
                          zoom,
                          this.projectParam
                        )
                      );
                    }
                  });
              }
            });
          },
          (error) => {
            console.log(error);
          }
        ));
  }

  public resetAllWaypoint(): void {
    this.sourceWaypointVector.clear();
    // this.sourceWaypointTextVector.clear();
    this.existingWaypointAtGeometry = [];
  }

  public createCircleExtent(pixel: Coordinate, zoom_level: number): Extent {
    return boundingExtent([pixel, [pixel[0] - 10, pixel[1] - 10], [pixel[0] + 10, pixel[1] + 10]]);
  }

  public mapOnClick(evt): void {
    const map: OsmMap.default = evt.map as OsmMap.default;
    var sourceVectorLayerBound = this.sourceWaypointLayer;
    // this.sourceWaypointVector.getFeatures().forEach(e => {
    //   var pos =  e.getGeometry().getCoordinates();
    //   console.log(pos);
    //   var size = (e.getStyle() as Style).getImage().getImageSize();
    //   var leftLower = [pos[0] - size[0] / 2, pos[1] - size[1] / 2];
    //   var leftUpper = [pos[0] - size[0] / 2, pos[1] + size[1] / 2];
    //   var rightUpper = [pos[0] + size[0] / 2, pos[1] - size[1] / 2];
    //   var rightLower = [pos[0] + size[0] / 2, pos[1] + size[1] / 2];
    //   var boundingBox = boundingExtent([leftLower, leftUpper, rightUpper, rightLower]);
    //   if (containsCoordinate(boundingBox, real_pixel)) {
    //     console.log("found");
    //   }
    // });
    // console.log("RealPixel:"+real_pixel);
    var point = undefined;
    var foundClustered = false;
    console.log(evt.pixel);
    this.map.forEachFeatureAtPixel(evt.pixel,
      function (feature, layer) {
        var clusteredFeatures = feature.get("features");
        if (clusteredFeatures.length == 1) {
          point = clusteredFeatures[0];
        } else if (clusteredFeatures.length > 1) {
          foundClustered = true;
        }
      },
      {
        hitTolerance: 3,
        checkWrapped: true,
        layerFilter: (layerToTest) => layerToTest == sourceVectorLayerBound
      }
    );
    if (!point) {
      if (foundClustered) {
        this.toastrService.info("An dieser Stelle gibt es mehrere Institutionen! Bitte Karte vergrößern", "Schoolfinder");
        return;
      } else if (!UserService.isLoggedIn()) {
        this.toastrService.info("An dieser Stelle gibt es keine eingetragenen Institutionen!", "Schoolfinder");
      }
    }
    console.log(point);
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
        id: 'olOverlayContainer'
      });
      if (this.showPointOverlay) {
        this.showPointOverlay.setVisible(false);
        this.showPointOverlayPlaceholder.clear();
      }
      this.map.addOverlay(overlayMap);
      this.addPointOverlay.setLat(latlong[0]);
      this.addPointOverlay.setLong(latlong[1]);
      this.addPointOverlay.prepareNewSchool().then((resTwo) => {
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
          pixel[0] += map.getSize()[0] / 3.2;
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
