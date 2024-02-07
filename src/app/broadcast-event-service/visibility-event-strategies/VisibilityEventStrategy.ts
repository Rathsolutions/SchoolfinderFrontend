import { Map } from "ol";
import { Source } from "ol/source";
import VectorSource from "ol/source/Vector";
import { SchoolfinderLayer } from "src/app/overlay/map-comp/layer/layer";

export enum VisibilityEventType {
    AREA, INSTITUTION_LEGEND
}


export interface VisibilityEventStrategy {
    performActionOnLayer(sourcePrimary: Source, sourceSecondary: Source, alternateSource: SchoolfinderLayer[], map: Map, visibilityDataElement: VisibilityDataElement);
    getEventType(): VisibilityEventType;
}
export class VisibilityDataElement {
    activeAreaStrategy: VisibilityEventStrategy;
}