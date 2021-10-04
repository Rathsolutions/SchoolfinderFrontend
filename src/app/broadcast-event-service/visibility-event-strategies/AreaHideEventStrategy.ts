import VectorLayer from "ol/layer/Vector";
import { Source } from "ol/source";
import VectorSource from "ol/source/Vector";
import { VisibilityEventStrategy } from "./VisibilityEventStrategy";

export class AreaHideEventStrategy implements VisibilityEventStrategy {
  performActionOnLayer(source: VectorSource<any>) {
    source.clear();
  }
}
