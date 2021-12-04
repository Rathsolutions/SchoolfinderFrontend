import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import { Source } from "ol/source";
import VectorSource from "ol/source/Vector";
import { VisibilityDataElement, VisibilityEventStrategy } from "./VisibilityEventStrategy";

export class AreaHideEventStrategy implements VisibilityEventStrategy {
  performActionOnLayer(primarySource: VectorSource<any>, secondarySource:VectorSource<any>, map:Map, visibilityDataElement:VisibilityDataElement) {
    primarySource.clear();
    secondarySource.clear();
    visibilityDataElement.activeAreaStrategy = this;
  }
}
