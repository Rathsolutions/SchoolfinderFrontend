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
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class SchoolTypeService extends BaseService<SchoolTypeDTO> {
  constructor(http: HttpClient, cookieService: CookieService) {
    super(http, cookieService, "schoolType");
  }

  public findSchoolTypesUsedAtLeastOnce(): Observable<SchoolTypeDTO[]> {
    return this.http.get<SchoolTypeDTO[]>(
      this.requestURL + "/search/findAllTypesUsedAtLeastOnce"
    );
  }

  public findSchoolTypesInProject(
    projectId: number
  ): Observable<SchoolTypeDTO[]> {
    return this.http.get<SchoolTypeDTO[]>(
      this.requestURL + "/search/findAllUsedTypesInProject",
      {
        params: {
          projectId: projectId,
        },
      }
    );
  }
}
