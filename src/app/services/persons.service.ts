//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SchoolPersonEntity } from "../entities/SchoolPersonEntity";
import { HttpClient, HttpXsrfTokenExtractor } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { PersonEntity } from "../entities/PersonEntity";
import { PersonFunctionality, PersonFunctionalityEntity } from "../entities/PersonFunctionalityEntity";
import { CookieService } from "ngx-cookie-service";
import { NgcCookieConsentService } from "ngx-cookieconsent";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class PersonsService extends BaseService<PersonEntity> {
  constructor(http: HttpClient, cookieService: CookieService, ccService: NgcCookieConsentService, toastrService: ToastrService) {
    super(http, cookieService, ccService, toastrService, "persons");
  }

  public putNewPerson(person: PersonEntity): Observable<PersonEntity> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    return this.http.put<PersonEntity>(
      this.requestURL + "/create/addNewPerson",
      person,
      httpOptions
    );
  }

  public getPersonsForSchool(id: number): Observable<PersonFunctionalityEntity[]> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    return this.http
      .get<PersonFunctionalityEntity[]>(this.requestURL + "/search/getPersonsForSchool", {
        params: {
          id: id.toString(),
        },
        withCredentials: httpOptions.withCredentials,
        headers: httpOptions.headers,
      })
      .pipe();
  }

  public getPerson(
    prename: string,
    lastname: string,
    email: string,
    phoneNumber: string
  ): Observable<PersonEntity> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    var credentials = httpOptions;
    return this.http
      .get<PersonEntity>(this.requestURL + "/search/getPerson", {
        params: {
          prename: prename,
          lastname: lastname,
          email: email,
          phoneNumber: phoneNumber
        },
        withCredentials: credentials.withCredentials,
        headers: credentials.headers,
      })
      .pipe(catchError(this.handleError(this.entity + ":validateCredentials")));
  }

  public getPersonExists(
    prename: string,
    lastname: string,
    email: string
  ): Observable<Boolean> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    var credentials = httpOptions;
    return this.http.get<Boolean>(this.requestURL + "/search/existsPerson", {
      params: {
        prename: prename,
        lastname: lastname,
        email: email,
      },
      withCredentials: credentials.withCredentials,
      headers: credentials.headers,
    });
  }

  public getNextPossibleEmails(
    prename: string,
    lastname: string,
    email: string,
    amount: number
  ): Observable<PersonEntity[]> {
    const httpOptions = this.getCredentialHttpOptionsAndCheckConsent();
    if (!httpOptions) {
      return;
    }
    return this.http
      .get<PersonEntity[]>(
        this.requestURL + "/search/getEmailRecommendations",
        {
          params: {
            prename: prename,
            lastname: lastname,
            email: email,
            amount: amount.toString(),
          },
          withCredentials: httpOptions.withCredentials,
          headers: httpOptions.headers,
        }
      )
      .pipe();
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
