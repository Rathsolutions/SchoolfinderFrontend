//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { SchoolPersonEntity } from '../entities/SchoolPersonEntity';
import { OsmPOIEntity } from '../entities/OsmPOIEntity';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CriteriaEntity } from '../entities/CriteriaEntity';

@Injectable({
    providedIn: 'root'
})
export class SchoolsService extends BaseService<SchoolPersonEntity> {
    constructor(
        http: HttpClient) {
        super(http, "schools");
    }

    public putNewSchool(school: SchoolPersonEntity): Observable<SchoolPersonEntity> {
        return this.http.put<SchoolPersonEntity>(this.requestURL + "/create/addNewSchool", school, BaseService.HTTP_OPTIONS)
            .pipe(catchError(this.handleError(this.entity + ':addNewSchool'))
            );
    }

    public patchSchool(school: SchoolPersonEntity): Observable<SchoolPersonEntity> {
        return this.http.patch<SchoolPersonEntity>(this.requestURL + "/edit/alterSchool", school, BaseService.HTTP_OPTIONS)
            .pipe(catchError(this.handleError(this.entity + ':alterSchool'))
            );
    }

    public deleteSchool(id: number): Observable<String> {
        var credentials = BaseService.HTTP_OPTIONS;
        return this.http.delete<String>(this.requestURL + "/delete/deleteSchool", {
            params: {
                'schoolId': id.toString()
            }, withCredentials: credentials.withCredentials, headers: credentials.headers
        });
    }

    public getSchoolsByBoundsAndCriterias(leftLatBound: number, rightLatBound: number, topLongBound: number, bottomLongBound: number, criterias: CriteriaEntity[], exclusiveSearch: boolean): Observable<SchoolPersonEntity[]> {
        var criteriasIds = [];
        criterias.forEach(e => {
            criteriasIds.push(e.id);
        })
        console.log(JSON.stringify(criteriasIds));
        return this.http.get<SchoolPersonEntity[]>(this.requestURL + "/search/findAllSchoolsInBounds", {
            params: {
                'leftLatBound': leftLatBound.toString(),
                'rightLatBound': rightLatBound.toString(),
                'topLongBound': topLongBound.toString(),
                'bottomLongBound': bottomLongBound.toString(),
                'criteriaNumbers': criteriasIds,
                'exclusiveSearch': exclusiveSearch.toString()
            }
        });
    }

    public getSchoolDetails(id: number): Observable<SchoolPersonEntity> {
        return this.http.get<SchoolPersonEntity>(this.requestURL + "/search/findSchoolDetails", {
            params: {
                id: id.toString()
            }
        });
    }

    public findPersonFunctionalityForPersonSchoolMapping(schoolId: number, personId: number, functionality: string) {
        return this.http.get<number>(this.requestURL + "/search/findPersonFunctionalityForPersonAndSchoolAndFunctionality", {
            params: {
                schoolId: schoolId.toString(),
                personId: personId.toString(),
                functionality: functionality
            }
        });
    }

    public searchSchoolInOsmFile(schoolname: string, cityname: string, amount:number): Observable<OsmPOIEntity[]> {
        var credentials = BaseService.HTTP_OPTIONS;
        return this.http.get<OsmPOIEntity[]>(this.requestURL + "/search/findNotRegisteredSchoolsByName", {
            params: {
                name: schoolname,
                city: cityname, 
                amount: amount.toString()
            }
        });
    }
}
