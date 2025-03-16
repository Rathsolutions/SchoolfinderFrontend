import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FunctionalityEntity } from "../entities/FunctionalityEntity";
import { BaseService } from "./base.service";
import { CookieService } from "ngx-cookie-service";
import { NgcCookieConsentService } from "ngx-cookieconsent";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root",
})
export class FunctionalityService extends BaseService<FunctionalityEntity> {
  constructor(http: HttpClient, cookieService: CookieService, ccService: NgcCookieConsentService, toastrService: ToastrService) {
    super(http, cookieService, ccService, toastrService, "functionality");
  }

  public findByName(name: string): Observable<FunctionalityEntity> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    return this.http
      .get<FunctionalityEntity>(
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
