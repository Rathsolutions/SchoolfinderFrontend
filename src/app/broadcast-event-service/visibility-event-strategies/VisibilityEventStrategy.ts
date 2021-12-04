import { Map } from "ol";
import { Source } from "ol/source";

export interface VisibilityEventStrategy{
    performActionOnLayer(sourcePrimary:Source, sourceSecondary:Source, map:Map, visibilityDataElement:VisibilityDataElement);
}
export class VisibilityDataElement{
    activeAreaStrategy:VisibilityEventStrategy;
}