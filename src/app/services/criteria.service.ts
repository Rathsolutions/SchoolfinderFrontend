//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CriteriaEntity } from '../entities/CriteriaEntity';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class CriteriaService extends BaseService<CriteriaEntity> {
    constructor(
        http: HttpClient, cookieService: CookieService, ccService: NgcCookieConsentService, toastrService: ToastrService) {
        super(http, cookieService, ccService, toastrService, "criterias");
    }

    public getPossibleCriterias(criteria: string, amount: number): Observable<CriteriaEntity[]> {
        const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
        if (!httpOptions) {
            return;
        }
        return this.http.get<CriteriaEntity[]>(this.requestURL + "/search/getCriteriaRecommendations", {
            params: {
                criteria: criteria,
                amount: amount.toString()
            }, withCredentials: httpOptions.withCredentials, headers: httpOptions.headers
        }).pipe();
    }

    public getAllCriterias(): Observable<CriteriaEntity[]> {
        return this.http.get<CriteriaEntity[]>(this.requestURL + "/search/getAllAvailableCriterias", { params: this.buildParams({}) }).pipe();
    }
}
