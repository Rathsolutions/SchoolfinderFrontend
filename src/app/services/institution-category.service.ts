//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CriteriaEntity } from "../entities/CriteriaEntity";
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { OsmPOIEntity } from "../entities/OsmPOIEntity";
import { InstitutionCategoryEntity } from "../entities/InstitutionCategoryEntity";
@Injectable({
  providedIn: "root",
})
export class InstitutionCategoryService extends BaseService<InstitutionCategoryEntity> {
  constructor(http: HttpClient) {
    super(http, "institutionCategory");
  }

  public findInstitutionCategoryByName(name: string): Observable<InstitutionCategoryEntity> {
    return this.http.get<InstitutionCategoryEntity>(this.requestURL + "/search/findCategoryByName", {
      params: {
        name: name,
      },
    });
  }
}
