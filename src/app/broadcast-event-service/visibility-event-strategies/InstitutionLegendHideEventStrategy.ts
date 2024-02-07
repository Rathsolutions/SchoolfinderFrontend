import { Map } from "ol";
import { Source } from "ol/source";
import { SchoolfinderLayer } from "src/app/overlay/map-comp/layer/layer";
import { VisibilityDataElement, VisibilityEventStrategy, VisibilityEventType } from "./VisibilityEventStrategy";

export class InstitutionLegendHideEventStrategy implements VisibilityEventStrategy {
    performActionOnLayer(sourcePrimary: Source, sourceSecondary: Source, alternateSource: SchoolfinderLayer[], map: Map, visibilityDataElement: VisibilityDataElement) {
        throw new Error("Method not supported");
    }
    getEventType(): VisibilityEventType {
        return VisibilityEventType.INSTITUTION_LEGEND;
    }
}