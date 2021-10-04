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
import { VisibilityEventStrategy } from "./VisibilityEventStrategy";

export class AreaShowEventStrategy implements VisibilityEventStrategy {
  constructor(private areaService: AreaService) {}

  performActionOnLayer(source: VectorSource<any>, map:Map) {
    source.clear();
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
        source.addFeature(polygon);
        var institutionFeature = FeatureFactory.createInstitutionFeature(
          e.id,
          e.name,
          e.areaInstitutionPosition,
          map.getView().getZoom()
        );
        source.addFeature(institutionFeature);
      });
    });
  }
}
