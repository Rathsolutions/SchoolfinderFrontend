import { Color } from "@angular-material-components/color-picker";
import { Feature, Map } from "ol";
import { Coordinate } from "ol/coordinate";
import { Polygon } from "ol/geom";
import { Source } from "ol/source";
import VectorSource from "ol/source/Vector";
import { AreaService } from "src/app/services/area.service";
import { ColorParser } from "src/app/util/color-parser";
import { FeatureFactory } from "src/app/util/FeatureFactory";
import { Styles } from "src/app/util/styles";
import { VisibilityEventService } from "../VisibilityEventService";
import { VisibilityDataElement, VisibilityEventStrategy, VisibilityEventType } from "./VisibilityEventStrategy";
import { SchoolfinderLayer } from "src/app/overlay/map-comp/layer/layer";

export class AreaShowEventStrategy implements VisibilityEventStrategy {
  constructor(private areaService: AreaService) {}
  getEventType(): VisibilityEventType {
    return VisibilityEventType.AREA;
}
  performActionOnLayer(areaSource: VectorSource<any>, markerSource:VectorSource<any>, alternateSource:SchoolfinderLayer[], map:Map, visibilityDataElement:VisibilityDataElement) {
    areaSource.clear();
    markerSource.clear();
    this.areaService.findAll().subscribe((res) => {
      res.forEach((e) => {
        var coordinatePoly: Coordinate[] = [];
        e.areaPolygon.forEach((areaP) => {
          coordinatePoly.push([areaP.latitude, areaP.longitude]);
        });
        let geometry = new Polygon([coordinatePoly]);
        var polygon = new Feature({
          geometry: geometry,
        });
        var color: Color = ColorParser.parseRgbaString(e.color);
        polygon.setStyle(Styles.getDrawStyle(color));
        polygon.setId(e.id);
        areaSource.addFeature(polygon);
        var institutionFeature = FeatureFactory.createInstitutionFeature(
          e.id,
          e.name,
          e.areaInstitutionPosition,
          map.getView().getZoom()
        );
        markerSource.addFeature(institutionFeature);
        visibilityDataElement.activeAreaStrategy = this;
        alternateSource.forEach(el=>el.setActive(true));
      });
    });
  }
}
