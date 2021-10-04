import { Map } from "ol";
import { Source } from "ol/source";

export interface VisibilityEventStrategy{
    performActionOnLayer(source:Source, map:Map);
}