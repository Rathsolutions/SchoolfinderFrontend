//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdditionalInformationEntity } from "../entities/AdditionalInformationEntity";
import { AreaEntity } from "../entities/AreaEntity";
import { OsmPOIEntity } from "../entities/OsmPOIEntity";
import { BaseService } from "./base.service";
@Injectable({
  providedIn: "root",
})
export class AdditionalInformationService extends BaseService<AdditionalInformationEntity> {
  constructor(http: HttpClient) {
    super(http, "additional-information");
  }


  public findAllTypes(): Observable<String[]> {
    return this.http
      .get<String[]>(this.requestURL + "/search/findAllTypes", {
        withCredentials: BaseService.HTTP_OPTIONS.withCredentials,
        headers: BaseService.HTTP_OPTIONS.headers,
      })
      .pipe();
  }

  public findByName(name: string): Observable<AdditionalInformationEntity> {
    return this.http
      .get<AdditionalInformationEntity>(
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
}
