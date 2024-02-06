//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreaEntity } from '../entities/AreaEntity';
import { OsmPOIEntity } from '../entities/OsmPOIEntity';
import { BaseService } from './base.service';
@Injectable({
  providedIn: 'root'
})
export class AreaService extends BaseService<AreaEntity> {
  constructor(
    http: HttpClient) {
    super(http, "area");
  }

  public findByName(name: string): Observable<AreaEntity> {
    return this.http
      .get<AreaEntity>(
        this.requestURL + "/search/findByName",
        {
          params: {
            name: name,
          },
          withCredentials: BaseService.HTTP_OPTIONS.withCredentials,
          headers: BaseService.HTTP_OPTIONS.headers,
        }
      )
      .pipe();
  }

  public findConcaveHull(): Observable<AreaEntity> {
    return this.http
      .get<AreaEntity>(
        this.requestURL + "/search/findConcaveHull",
      )
      .pipe();
  }

}
