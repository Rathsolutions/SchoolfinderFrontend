import { Color } from "@angular-material-components/color-picker";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { ProjectCategoryEntity } from "../entities/ProjectEntity";
import { SchoolPersonEntity } from "../entities/SchoolPersonEntity";
import { SchoolTypeDTO } from "../entities/SchoolTypeDTO";
import { Polygon } from "ol/geom";
import { Coordinate } from "ol/coordinate";
import { boundingExtent } from "ol/extent";
import { fromExtent } from "ol/geom/Polygon";

export class Styles {
  //Different Icon, maybe flag or google marker
  public static getStyleForAreaInstitutionPoint(
    shortText: string,
    longText: string,
    zoom: any
  ) {
    var textToSet = zoom <= 9 && shortText ? shortText : longText;
    var splitted = textToSet.split(" ");
    textToSet = "";
    for (let i = 0; i < splitted.length; i++) {
      textToSet += splitted[i];
      if (i != splitted.length - 1) {
        textToSet += "\n";
      }
    }
    return new Style({
      text: new Text({
        text: textToSet,
        offsetY: -20,
        font: "bold italic " + 15 + "px/1.0 sans-serif",
        stroke: new Stroke({
          color: "white",

        }),
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

  public static createTextStyleForWaypoint(color: any, textToSet: string, zoom: number) {
    console.log(zoom);
    return new Text({
      fill: new Fill({
        color: "rgb(" + (color.r) + "," + (color.g) + "," + (color.b) + ")"

      }),
      stroke: new Stroke({
        color: "white"
      }),
      text: textToSet,
      offsetY: -25,
      font: "bold italic " + 10 * 1.55 + "px/1.0 sans-serif",
    });
  }

  public static getCombinedStyleForWaypoint(e: SchoolPersonEntity,
    zoom: any,
    project?: ProjectCategoryEntity) {
    var selectedProject = project;
    if (!project) {
      selectedProject = e.primaryProject;
    }
    var scale = selectedProject.scaling ? selectedProject.scaling : 0.03;
    var color = e.schoolType ? e.schoolType : { r: 0, g: 0, b: 0 };
    var textToSet =
      zoom <= 9 && e.shortSchoolName ? e.shortSchoolName : e.schoolName;

    var icon = new Icon({
      scale: scale,
      src: selectedProject.icon
    });
    return new Style({
      image: icon,
      text: Styles.createTextStyleForWaypoint(color, textToSet, zoom),
      zIndex: 1,
    });
  }


  public static getImageStyleForWaypoint(
    e: SchoolPersonEntity,
    zoom: any,
    project?: ProjectCategoryEntity
  ) {
    var selectedProject = project;
    if (!project) {
      selectedProject = e.primaryProject;
    }
    var scale = selectedProject.scaling ? selectedProject.scaling : 0.03;
    // if(zoom <=7){
    //   scale = 0.05;
    // }
    return new Style({
      image: new Icon({
        scale: scale,
        src: selectedProject.icon,
      }),
    });
  }

  public static getTextStyleForWaypoint(
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
    var color = e.schoolType ? e.schoolType : { r: 0, g: 0, b: 0 };
    return new Style({
      text: this.createTextStyleForWaypoint(color, textToSet, zoom),
      zIndex: 1
    });
  }


  public static getTextStyleForClusteredWaypoints(zoom: number, amountOfClusteredEntries: number
  ) {
    var color = { r: 0, g: 0, b: 0 };
    return new Style({
      text: new Text({
        fill: new Fill({
          color: "rgb(" + (color.r) + "," + (color.g) + "," + (color.b) + ")"

        }),
        stroke: new Stroke({
          color: "white"
        }),
        text: "Institutionsanzahl: " + amountOfClusteredEntries,
        offsetY: -20,
        font: "bold italic " + zoom * 1.55 + "px/1.0 sans-serif",
      }),
      zIndex: 1
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
