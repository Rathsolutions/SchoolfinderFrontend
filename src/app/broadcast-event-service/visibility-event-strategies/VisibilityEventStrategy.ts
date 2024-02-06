import { Map } from "ol";
import { Source } from "ol/source";
import VectorSource from "ol/source/Vector";
import { SchoolfinderLayer } from "src/app/overlay/map-comp/layer/layer";

export interface VisibilityEventStrategy{
    performActionOnLayer(sourcePrimary:Source, sourceSecondary:Source, alternateSource:SchoolfinderLayer[], map:Map, visibilityDataElement:VisibilityDataElement);
}
export class VisibilityDataElement{
    activeAreaStrategy:VisibilityEventStrategy;
}