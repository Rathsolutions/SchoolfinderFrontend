import { Color } from "@angular-material-components/color-picker";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { ProjectCategoryEntity } from "../entities/ProjectEntity";
import { SchoolPersonEntity } from "../entities/SchoolPersonEntity";
import { SchoolTypeDTO } from "../entities/SchoolTypeDTO";

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
      // image: new Icon({
      //   scale: 0.01,
      //   src: "assets/logo/zsllogo.png",
      // }),
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: "#ff0000" }),
        stroke: new Stroke({ color: "black" }),
      }),
    });
  }
  public static getStyleForWaypoint(
    e: SchoolPersonEntity,
    zoom: any,
    project?: ProjectCategoryEntity
  ) {
    var textToSet =
      zoom <= 9 && e.shortSchoolName ? e.shortSchoolName : e.schoolName;
      var selectedProject = project;
    if (!project) {
      selectedProject = e.primaryProject;
    }
    var color = e.schoolType ? e.schoolType : {r:0,g:0,b:0};
    return new Style({
      text: new Text({
        fill: new Fill({
          color: "rgb(" + (color.r) + "," + (color.g) + "," + (color.b) + ")"
        }),
        text: textToSet,
        offsetY: -20,
        font: "bold italic " + zoom * 1.15 + "px/1.0 sans-serif",
      }),
      image: new Icon({
        scale: selectedProject.scaling ? selectedProject.scaling : 0.03,
        src: selectedProject.icon,
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
        // stroke: stroke,
      }),
    ];
  }
}
