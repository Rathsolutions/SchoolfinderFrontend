import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FunctionalityEntity } from "../entities/FunctionalityEntity";
import { BaseService } from "./base.service";
@Injectable({
  providedIn: "root",
})
export class FunctionalityService extends BaseService<FunctionalityEntity> {
  constructor(http: HttpClient) {
    super(http, "functionality");
  }

  public findByName(name: string): Observable<FunctionalityEntity> {
    return this.http
      .get<FunctionalityEntity>(
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
