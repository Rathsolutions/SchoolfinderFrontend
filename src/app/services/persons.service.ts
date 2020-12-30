//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { SchoolPersonEntity } from '../entities/SchoolPersonEntity';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PersonEntity } from '../entities/PersonEntity';

@Injectable({
    providedIn: 'root'
})
export class PersonsService extends BaseService<PersonEntity> {
    constructor(
        http: HttpClient) {
        super(http, "persons");
    }

    public putNewPerson(person: PersonEntity): Observable<PersonEntity> {
        return this.http.put<PersonEntity>(this.requestURL + "/create/addNewPerson", person, BaseService.HTTP_OPTIONS);
    }


    public getPerson(prename: string, lastname: string, email: string): Observable<PersonEntity> {
        var credentials = BaseService.HTTP_OPTIONS;
        return this.http.get<PersonEntity>(this.requestURL + "/search/getPerson", {
            params: {
                prename: prename,
                lastname: lastname,
                email: email
            }, withCredentials: credentials.withCredentials, headers: credentials.headers
        }).pipe(catchError(this.handleError(this.entity + ':validateCredentials'))
        );
    }

    public getPersonExists(prename: string, lastname: string, email: string): Observable<Boolean> {
        var credentials = BaseService.HTTP_OPTIONS;
        return this.http.get<Boolean>(this.requestURL + "/search/existsPerson", {
            params: {
                prename: prename,
                lastname: lastname,
                email: email
            }, withCredentials: credentials.withCredentials, headers: credentials.headers
        });
    }

    public getNextPossibleEmails(prename: string, lastname: string, email: string, amount: number): Observable<PersonEntity[]> {
        return this.http.get<PersonEntity[]>(this.requestURL + "/search/getEmailRecommendations", {
            params: {
                prename: prename,
                lastname: lastname,
                email: email,
                amount: amount.toString()
            }, withCredentials: BaseService.HTTP_OPTIONS.withCredentials, headers: BaseService.HTTP_OPTIONS.headers
        }).pipe();
        // return this.http.get<PersonEntity[]>(this.requestURL + "/search/getEmailRecommendations", {
        //     params: {
        //         prename: prename,
        //         lastname: lastname,
        //         email: email,
        //         amount: amount.toString()
        //     }, withCredentials: credentials.withCredentials, headers: credentials.headers
        // }).pipe(catchError(this.handleError(this.entity + ':validateCredentials'))
        // );
    }
}
