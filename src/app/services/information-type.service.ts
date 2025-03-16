//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AdditionalInformationDTO } from "../entities/AdditionalInformationEntity";
import { AreaEntity } from "../entities/AreaEntity";
import { InformationType } from "../entities/InformationType";
import { OsmPOIEntity } from "../entities/OsmPOIEntity";
import { BaseService } from "./base.service";
import { CookieService } from "ngx-cookie-service";
import { NgcCookieConsentService } from "ngx-cookieconsent";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root",
})
export class InformationTypeService extends BaseService<InformationType> {
  constructor(http: HttpClient, cookieService: CookieService, ccService: NgcCookieConsentService, toastrService: ToastrService) {
    super(http, cookieService, ccService, toastrService, "informationType");
  }

  public findByValue(name: string): Observable<InformationType> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    return this.http
      .get<InformationType>(
        this.requestURL + "/search/findByName",
        {
          params: {
            name: name,
          },
          withCredentials: httpOptions.withCredentials,
          headers: httpOptions.headers,
        }
      )
      .pipe();
  }
}
