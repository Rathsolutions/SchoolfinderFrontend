import { Source } from "ol/source";
import { VisibilityDataElement, VisibilityEventStrategy, VisibilityEventType } from "./VisibilityEventStrategy";
import { SchoolfinderLayer } from "src/app/overlay/map-comp/layer/layer";
import { Map } from "ol";

export class InstitutionLegendShowEventStrategy implements VisibilityEventStrategy {
    getEventType(): VisibilityEventType {
        return VisibilityEventType.INSTITUTION_LEGEND;
    }
    performActionOnLayer(sourcePrimary: Source, sourceSecondary: Source, alternateSource: SchoolfinderLayer[], map: Map, visibilityDataElement: VisibilityDataElement) {
        throw new Error("Method not supported");

    }

}