import VectorLayer from "ol/layer/Vector";
import { MapCompComponent } from "../map-comp.component";
import { Vector } from "ol/source";
import VectorSource from "ol/source/Vector";
import { AreaSelectionService } from "src/app/broadcast-event-service/AreaSelectionService";
import { AreaService } from "src/app/services/area.service";
import { Coordinate } from "ol/coordinate";
import { Polygon } from "ol/geom";
import { Feature, Map } from "ol";
import { ColorParser } from "src/app/util/color-parser";
import { Styles } from "src/app/util/styles";
import { Fill, Style } from "ol/style";
import { Color } from "@angular-material-components/color-picker";
import { FeatureLike } from "ol/Feature";
import { containsCoordinate } from "ol/extent";
import { SchoolfinderLayer } from "./layer";

const noFill = new Style({ fill: new Fill({ color: new Color(255, 255, 255, 0).toRgba() }) });
const greyFill = new Style({ fill: new Fill({ color: new Color(255, 255, 255, 0.8).toRgba() }) });
export class DarkenLayer implements SchoolfinderLayer {
    darkenLayer: VectorLayer<Vector<any>>;
    darkenSource: VectorSource<any>;

    currentSelected: FeatureLike;

    activated: boolean = false;
    initialHit:boolean = true;

    constructor(areaService: AreaService) {
        this.darkenSource = new VectorSource({
        });
        this.darkenLayer = new VectorLayer({
            source: this.darkenSource,

        });
        areaService.findAll().subscribe(el => {
            el.forEach(area => {
                var coordinatePoly: Coordinate[] = [];
                area.areaPolygon.forEach((areaP) => {
                    coordinatePoly.push([areaP.latitude, areaP.longitude]);
                });
                let geometry = new Polygon([coordinatePoly]);
                var polygon = new Feature({
                    geometry: geometry,

                });
                polygon.setStyle(noFill);
                polygon.setId(area.id);
                this.darkenSource.addFeature(polygon);
            })

        });
        this.darkenLayer.setZIndex(3);

    }
    addToMap(map: Map) {
        map.addLayer(this.darkenLayer);
        var instance = this;
        map.on("pointermove", (evt) => {
            if (!instance.activated) {
                    return;
            }
            if (instance.currentSelected && !(instance.currentSelected as Feature).getGeometry().intersectsCoordinate(map.getCoordinateFromPixel(evt.pixel))) {
                (instance.currentSelected as Feature).setStyle(noFill);
                instance.currentSelected = undefined;
            }
            map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                if (feature == instance.currentSelected) {
                    return;
                }
                if (instance.currentSelected) {
                    (instance.currentSelected as Feature).setStyle(noFill);
                }
                instance.currentSelected = feature;
                (feature as Feature).setStyle(greyFill);
            }, { layerFilter: (layer) => layer == instance.darkenLayer });
        });
    }
    setActive(active: boolean) {
        if(active){
            this.darkenSource.getFeatures().forEach(feature=>{
                feature.setStyle(noFill);
            });
        }else{
            this.darkenSource.getFeatures().forEach(feature=>{
                feature.setStyle(greyFill);
            });            
        }
        this.activated = active;
    }

}