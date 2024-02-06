import VectorLayer from "ol/layer/Vector";
import { MapCompComponent } from "../map-comp.component";
import { Vector } from "ol/source";
import VectorSource from "ol/source/Vector";
import { AreaSelectionService } from "src/app/broadcast-event-service/AreaSelectionService";
import { AreaService } from "src/app/services/area.service";
import { Coordinate } from "ol/coordinate";
import { Polygon } from "ol/geom";
import { Feature } from "ol";
import * as OsmMap from "ol/Map";
import { ColorParser } from "src/app/util/color-parser";
import { Styles } from "src/app/util/styles";
import { Fill, Style } from "ol/style";
import { Color } from "@angular-material-components/color-picker";
import { FeatureLike } from "ol/Feature";
import { containsCoordinate } from "ol/extent";
import { SchoolfinderLayer } from "./layer";
import { FeatureFactory } from "src/app/util/FeatureFactory";
import { AreaEntity } from "src/app/entities/AreaEntity";

const noFill = new Style({ fill: new Fill({ color: new Color(255, 255, 255, 0).toRgba() }) });
const greyFill = new Style({ fill: new Fill({ color: new Color(255, 255, 255, 0.8).toRgba() }) });
export class DarkenLayer implements SchoolfinderLayer {
    darkenLayer: VectorLayer<Vector<any>>;
    darkenSource: VectorSource<any>;

    currentSelected: FeatureLike;

    activated: boolean = false;
    initialHit: boolean = true;

    areaInstitutionList: Map<number, string> = new Map();
    hiddenList: string[] = [];

    constructor(private areaService: AreaService, private mapComp: MapCompComponent) {
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
                this.areaInstitutionList.set(area.id, area.name);
            })

        });
        this.darkenLayer.setZIndex(3);

    }
    addToMap(map: OsmMap.default) {
        map.addLayer(this.darkenLayer);
        var instance = this;
        map.on("pointermove", (evt) => {
            if (!instance.activated) {
                return;
            }
            if (instance.currentSelected && !(instance.currentSelected as Feature).getGeometry().intersectsCoordinate(map.getCoordinateFromPixel(evt.pixel))) {
                instance.mapComp.sourceAreaTextVector.getFeatureById(instance.currentSelected.getId() + FeatureFactory.POINT).setStyle(Styles.getStyleForAreaInstitutionPoint("", "", 9, false));
                (instance.currentSelected as Feature).setStyle(noFill);
                instance.currentSelected = undefined;
            }
            map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                var curAreaText = instance.mapComp.sourceAreaTextVector.getFeatureById(feature.getId() + FeatureFactory.POINT);
                // map.forEachFeatureAtPixel(map.getPixelFromCoordinate(curAreaText.getGeometry().flatCoordinates), (featureAtThere) => {
                //     if(featureAtThere.getId()){
                //         console.log(featureAtThere);
                //         instance.hiddenList.push(featureAtThere.getId().toString());
                //         ((featureAtThere as Feature).getStyle() as Style).getText().setText("");
                //     }
                // }, { hitTolerance: 30, layerFilter: (layer) => instance.mapComp.sourceWaypointLayer == layer });
                if (feature == instance.currentSelected) {
                    return;
                }
                if (instance.currentSelected) {
                    instance.mapComp.sourceAreaTextVector.getFeatureById(instance.currentSelected.getId() + FeatureFactory.POINT).setStyle(Styles.getStyleForAreaInstitutionPoint("", "", 9, false));
                    (instance.currentSelected as Feature).setStyle(noFill);
                }
                instance.currentSelected = feature;
                (feature as Feature).setStyle(greyFill);
                var areaName = instance.areaInstitutionList.get(feature.getId() as number);
                curAreaText.setStyle(Styles.getStyleForAreaInstitutionPoint(areaName, areaName, map.getView().getZoom(), true));

                // instance.areaService.findAreaInstitutionPointById(feature.getId() as number).subscribe(res => {
                // });
            }, { hitTolerance: 0, layerFilter: (layer) => layer == instance.darkenLayer });
            // map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            //     (feature as Feature).setStyle()
            // }, { layerFilter: (layer) => layer == this.mapComp.source });
        });
    }
    setActive(active: boolean) {
        if (active) {
            this.darkenSource.getFeatures().forEach(feature => {
                feature.setStyle(noFill);
            });
        } else {
            this.darkenSource.getFeatures().forEach(feature => {
                feature.setStyle(greyFill);
            });
        }
        this.activated = active;
    }

}