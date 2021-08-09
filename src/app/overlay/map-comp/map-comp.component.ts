import { Component, Input, OnInit } from "@angular/core";
import { Feature, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import Projection from "ol/proj/Projection";
import { XYZ } from "ol/source";
import { transform, toLonLat, transformExtent } from "ol/proj";
import { UserService } from "src/app/services/user.service";
import { SchoolsService } from "src/app/services/schools.service";
import { Point } from "ol/geom";
import { CriteriaEntity } from "src/app/entities/CriteriaEntity";
import { CriteriaFilterComponent } from "../filter/criteria/criteria.component";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { SchoolPersonEntity } from "src/app/entities/SchoolPersonEntity";
import VectorSource from "ol/source/Vector";

@Component({
  selector: "app-map-comp",
  templateUrl: "./map-comp.component.html",
  styleUrls: ["./map-comp.component.css"],
})
export class MapCompComponent implements OnInit {
  private map: Map;
  private mapLayer: TileLayer;
  private mapSource: XYZ;

  private existingWaypointAtGeometry: [number, number][] = [];

  @Input()
  private criteriasObject: CriteriaFilterComponent;
  sourceWaypointVector: VectorSource;

  constructor(private schoolsService: SchoolsService) {}

  ngOnInit(): void {
    console.log("init");
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
    this.map.on("singleClick", (e) => {
      this.mapOnClick(e);
    });
    this.map.on("moveend", () => {
      this.updateWaypoints();
    });
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
      // this.addPointOverlayPlaceholder.prepareNewSchool();
      // if (point) {
      //   this.addPointOverlayPlaceholder.prefillByPointId(
      //     (point as any).getId()
      //   );
      // }
      // this.addPointOverlayLat = latlong[0];
      // this.addPointOverlayLong = latlong[1];
      // this.adminOverlayVisible = true;
      // this.overlayVisible = false;
      // this.showPointOverlayPlaceholder.setVisible(false);
      // this.addPointOverlayPlaceholder.setLat(this.addPointOverlayLat);
      // this.addPointOverlayPlaceholder.setLong(this.addPointOverlayLong);
      // this.addPointOverlayPlaceholder.setVisible(true);
    } else if (!UserService.isLoggedIn() && point) {
      // this.infoboxLat = latlong[0];
      // this.infoboxLong = latlong[1];
      // this.overlayVisible = true;
      // this.showPointOverlayPlaceholder
      //   .loadNewSchool((point as any).getId())
      //   .then((res) => {
      //     var pixel = map.getPixelFromCoordinate(evt.coordinate);
      //     pixel[0] += map.getSize()[0] / 4;
      //     pixel[1] += map.getSize()[1] / 2.5;
      //     var box = map.getCoordinateFromPixel(pixel);
      //     this.mapView.instance.animate({ center: box });
      //   });
      // this.showPointOverlayPlaceholder.setVisible(true);
    } else {
      // this.overlayVisible = false;
    }
  }
}
