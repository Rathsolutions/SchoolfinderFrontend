//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdditionalInformationEntity } from "../entities/AdditionalInformationEntity";
import { AreaEntity } from "../entities/AreaEntity";
import { InformationType } from "../entities/InformationType";
import { OsmPOIEntity } from "../entities/OsmPOIEntity";
import { BaseService } from "./base.service";
@Injectable({
  providedIn: "root",
})
export class InformationTypeService extends BaseService<InformationType> {
  constructor(http: HttpClient) {
    super(http, "informationType");
  }

  public findByValue(name: string): Observable<InformationType> {
    return this.http
      .get<InformationType>(
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
