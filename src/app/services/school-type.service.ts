//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SchoolPersonEntity } from "../entities/SchoolPersonEntity";
import { OsmPOIEntity } from "../entities/OsmPOIEntity";
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { CriteriaEntity } from "../entities/CriteriaEntity";
import { ProjectCategoryEntity } from "../entities/ProjectEntity";
import { SchoolTypeDTO } from "../entities/SchoolTypeDTO";

@Injectable({
  providedIn: "root",
})
export class SchoolTypeService extends BaseService<SchoolTypeDTO> {
  constructor(http: HttpClient) {
    super(http, "schoolType");
  }

  public getAllTypes(): Observable<String[]> {
    return this.http.get<String[]>(this.requestURL + "/search/getAllTypes", BaseService.HTTP_OPTIONS);
  }

}
