//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from "@angular/core";
import { SchoolPersonEntity } from "../../entities/SchoolPersonEntity";
import { OsmPOIEntity } from "../../entities/OsmPOIEntity";
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http";
import { catchError, map, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { CriteriaEntity } from "../../entities/CriteriaEntity";
import { ProjectCategoryEntity } from "../../entities/ProjectEntity";
import { SchoolTypeDTO } from "../../entities/SchoolTypeDTO";
import { SchoolsService } from "../schools.service";
import { ProjectCategoryService } from "../project-category.service";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";

@Injectable({
    providedIn: "root",
})
export class SchoolsDao {

    private allFoundProjectsCache: Map<number, string> = new Map();
    constructor(private schoolsService: SchoolsService, private projectService: ProjectCategoryService, mapUpdateEventService: MapUpdateEventService) {
        mapUpdateEventService.register().subscribe((res) => {
            if (res) {
                this.allFoundProjectsCache = new Map();
            }
        });
    }

    public putNewSchool(
        school: SchoolPersonEntity
    ): Observable<SchoolPersonEntity> {
        return this.schoolsService.putNewSchool(school);
    }

    public patchSchool(
        school: SchoolPersonEntity
    ): Observable<SchoolPersonEntity> {
        return this.schoolsService.patchSchool(school);
    }

    public deleteSchool(id: number): Observable<String> {
        return this.schoolsService.deleteSchool(id);
    }

    public async getSchoolsByBoundsAndCriteriasAndSchoolTypesAndProject(
        leftLatBound: number,
        rightLatBound: number,
        topLongBound: number,
        bottomLongBound: number,
        projectId: number,
        criterias: CriteriaEntity[],
        schoolTypes: SchoolTypeDTO[],
        exclusiveSearch: boolean
    ): Promise<Observable<SchoolPersonEntity[]>> {
        if (this.allFoundProjectsCache.size <= 0) {
            if (projectId) {
                var curProject = await this.projectService.findProjectById(projectId).toPromise();
                this.allFoundProjectsCache.set(curProject.id, curProject.icon);
            } else {
                var allProjects = await this.projectService.findAll().toPromise();
                allProjects.forEach(project => {
                    this.allFoundProjectsCache.set(project.id, project.icon);
                });
            }
        }
        return this.schoolsService.getSchoolsByBoundsAndCriteriasAndSchoolTypesAndProject(leftLatBound, rightLatBound, topLongBound, bottomLongBound, projectId, criterias, schoolTypes, exclusiveSearch)
            .pipe(map(schoolPersonEntities => {
                schoolPersonEntities.forEach(schoolPersonEntity => {
                    schoolPersonEntity.projects.forEach(async project => {
                        project.icon = this.allFoundProjectsCache.get(project.id);
                    });
                    schoolPersonEntity.primaryProject.icon = this.allFoundProjectsCache.get(schoolPersonEntity.primaryProject.id);
                });
                return schoolPersonEntities;
            }));
    }

    public getAllSchools(): Observable<SchoolPersonEntity[]> {
        return this.schoolsService.getAllSchools();
    }

    public getAllSchoolsOrderedByName(): Observable<SchoolPersonEntity[]> {
        return this.schoolsService.getAllSchoolsOrderedByName();
    }

    public getSchoolDetails(id: number): Observable<SchoolPersonEntity> {
        return this.schoolsService.getSchoolDetails(id);
    }

    public findPersonFunctionalityForPersonSchoolMapping(
        schoolId: number,
        personId: number,
        functionality: string
    ) {
        return this.schoolsService.findPersonFunctionalityForPersonSchoolMapping(schoolId, personId, functionality);
    }

    public searchSchoolInOsmFile(
        schoolname: string,
        cityname: string,
        amount: number
    ): Observable<OsmPOIEntity[]> {
        return this.schoolsService.searchSchoolInOsmFile(schoolname, cityname, amount);
    }
}
