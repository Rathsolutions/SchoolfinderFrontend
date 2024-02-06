import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import { Source } from "ol/source";
import VectorSource from "ol/source/Vector";
import { VisibilityDataElement, VisibilityEventStrategy } from "./VisibilityEventStrategy";
import { SchoolfinderLayer } from "src/app/overlay/map-comp/layer/layer";

export class AreaHideEventStrategy implements VisibilityEventStrategy {
  performActionOnLayer(primarySource: VectorSource<any>, secondarySource: VectorSource<any>, alternateSource: SchoolfinderLayer[], map: Map, visibilityDataElement: VisibilityDataElement) {
    primarySource.clear();
    secondarySource.clear();
    visibilityDataElement.activeAreaStrategy = this;
    alternateSource.forEach(el=>el.setActive(false));
  }
}
