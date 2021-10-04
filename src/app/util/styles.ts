import { Color } from "@angular-material-components/color-picker";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { SchoolPersonEntity } from "../entities/SchoolPersonEntity";

export class Styles {
  //Different Icon, maybe flag or google marker
  public static getStyleForAreaInstitutionPoint(
    shortText: string,
    longText: string,
    zoom: any
  ) {
    var textToSet = zoom <= 9 && shortText ? shortText : longText;
    return new Style({
      text: new Text({
        text: textToSet,
        offsetY: -20,
        font: "bold italic " + zoom * 1.15 + "px/1.0 sans-serif",
      }),
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: "#ff0000" }),
        stroke: new Stroke({ color: "black" }),
      }),
    });
  }
  public static getStyleForWaypoint(e: SchoolPersonEntity, zoom: any) {
    var textToSet =
      zoom <= 9 && e.shortSchoolName ? e.shortSchoolName : e.schoolName;
    return new Style({
      text: new Text({
        text: textToSet,
        offsetY: -20,
        font: "bold italic " + zoom * 1.15 + "px/1.0 sans-serif",
      }),
      image: new Icon({
        scale: e.project.scaling ? e.project.scaling : 0.03,
        src: e.project.icon,
      }),
    });
  }
  public static getDrawStyle(color: Color): Style[] {
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
}
