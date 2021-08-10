import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CriteriaEntity } from "../entities/CriteriaEntity";
import { BroadcastService } from "./BroadcastService";
@Injectable({
  providedIn: "root",
})
export class ZoomToEventService implements BroadcastService<ZoomEventMessage> {
  private eventQueue = new Subject<ZoomEventMessage>();
  register(): Observable<ZoomEventMessage> {
    return this.eventQueue;
  }
  emit(eventMessage: ZoomEventMessage): void {
    this.eventQueue.next(eventMessage);
  }
}
export class ZoomEventMessage {
  private _latitude: number;
  public get latitude(): number {
    return this._latitude;
  }
  public set latitude(value: number) {
    this._latitude = value;
  }
  private _longitude: number;
  public get longitude(): number {
    return this._longitude;
  }
  public set longitude(value: number) {
    this._longitude = value;
  }
  private _zoomLevel: number;
  public get zoomLevel(): number {
    return this._zoomLevel;
  }
  public set zoomLevel(value: number) {
    this._zoomLevel = value;
  }
  constructor(latitude: number, longitude: number, zoomLevel: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoomLevel = zoomLevel;
  }
}
