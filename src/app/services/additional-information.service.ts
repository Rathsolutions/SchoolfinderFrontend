//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { AdditionalInformationDTO } from "../entities/AdditionalInformationEntity";
import { BaseService } from "./base.service";
import { NgcCookieConsentService } from "ngx-cookieconsent";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root",
})
export class AdditionalInformationService extends BaseService<AdditionalInformationDTO> {
  constructor(http: HttpClient, cookieService: CookieService, ccService: NgcCookieConsentService, toastrService: ToastrService,
  ) {
    super(http, cookieService, ccService, toastrService, "additional-information");
  }


  public findByName(name: string): Observable<AdditionalInformationDTO> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    return this.http
      .get<AdditionalInformationDTO>(
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
