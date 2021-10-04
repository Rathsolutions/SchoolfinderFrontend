import { Feature } from "ol";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { Position } from "../entities/Position";
import { Styles } from "./styles";
export class FeatureFactory{
    public static POINT = "Point";
    public static createInstitutionFeature(id: number, name: string, pos: Position, zoom:number) {
        var institutionFeature = new Feature({
          geometry: new Point(
            transform([pos.latitude, pos.longitude], "EPSG:4326", "EPSG:3857")
          ),
        });
        var institutionStyle = Styles.getStyleForAreaInstitutionPoint(
          name,
          name,
          zoom
        );
        institutionFeature.setStyle(institutionStyle);
        institutionFeature.setId(id + FeatureFactory.POINT);
        return institutionFeature;
      }
}