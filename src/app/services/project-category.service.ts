//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { CriteriaEntity } from "../entities/CriteriaEntity";
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { OsmPOIEntity } from "../entities/OsmPOIEntity";
import { ProjectCategoryEntity } from "../entities/ProjectEntity";
import { SchoolPersonEntity } from "../entities/SchoolPersonEntity";
@Injectable({
  providedIn: "root",
})
export class ProjectCategoryService extends BaseService<ProjectCategoryEntity> {
  constructor(http: HttpClient) {
    super(http, "project");
  }

  public findProjectByName(name: string): Observable<ProjectCategoryEntity> {
    return this.http.get<ProjectCategoryEntity>(
      this.requestURL + "/search/getProjectByName/" + name,
      BaseService.HTTP_OPTIONS
    );
  }

  public findAllSchoolsForProjectWithId(
    id: number
  ): Observable<SchoolPersonEntity[]> {
    return this.http.get<SchoolPersonEntity[]>(
      this.requestURL + "/search/getAllSchoolsForProjectWithId",
      {
        params: {
          id: id,
        },
      }
    );
  }
}
