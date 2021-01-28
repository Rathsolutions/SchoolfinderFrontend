//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CriteriaEntity } from '../entities/CriteriaEntity';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CriteriaService extends BaseService<CriteriaEntity> {
    constructor(
        http: HttpClient) {
        super(http, "criterias");
    }

    public getPossibleCriterias(criteria: string, amount: number): Observable<CriteriaEntity[]> {
        return this.http.get<CriteriaEntity[]>(this.requestURL + "/search/getCriteriaRecommendations", {
            params: {
                criteria: criteria,
                amount: amount.toString()
            }, withCredentials: BaseService.HTTP_OPTIONS.withCredentials, headers: BaseService.HTTP_OPTIONS.headers
        }).pipe();
    }

    public getAllCriterias(): Observable<CriteriaEntity[]> {
        return this.http.get<CriteriaEntity[]>(this.requestURL + "/search/getAllAvailableCriterias").pipe();
    }
}
