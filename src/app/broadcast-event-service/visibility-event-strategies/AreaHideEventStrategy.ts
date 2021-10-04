import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import { Source } from "ol/source";
import VectorSource from "ol/source/Vector";
import { VisibilityDataElement, VisibilityEventStrategy } from "./VisibilityEventStrategy";

export class AreaHideEventStrategy implements VisibilityEventStrategy {
  performActionOnLayer(source: VectorSource<any>,map:Map, visibilityDataElement:VisibilityDataElement) {
    source.clear();
    visibilityDataElement.activeAreaStrategy = this;
  }
}
