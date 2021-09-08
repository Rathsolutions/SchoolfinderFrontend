import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonCategoryEntity } from "../entities/PersonCategoryEntity";
import { BaseService } from "./base.service";
@Injectable({
  providedIn: "root",
})
export class PersonCategorService extends BaseService<PersonCategoryEntity> {
  constructor(http: HttpClient) {
    super(http, "personCategory");
  }

  public findInstitutionCategoryByName(
    name: string
  ): Observable<PersonCategoryEntity> {
    return this.http.get<PersonCategoryEntity>(
      this.requestURL + "/search/findCategoryByName",
      {
        params: {
          name: name,
        },
      }
    );
  }
}
