import { Coordinate } from "ol/coordinate";

export class Position {
  latitude: number;
  longitude: number;

  public convertToCoordinate(): Coordinate {
    return [this.latitude, this.longitude];
  }
}
