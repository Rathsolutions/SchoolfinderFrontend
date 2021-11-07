//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdditionalInformationDTO } from "../entities/AdditionalInformationEntity";
import { AreaEntity } from "../entities/AreaEntity";
import { OsmPOIEntity } from "../entities/OsmPOIEntity";
import { BaseService } from "./base.service";
@Injectable({
  providedIn: "root",
})
export class AdditionalInformationService extends BaseService<AdditionalInformationDTO> {
  constructor(http: HttpClient) {
    super(http, "additional-information");
  }


  public findByName(name: string): Observable<AdditionalInformationDTO> {
    return this.http
      .get<AdditionalInformationDTO>(
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
