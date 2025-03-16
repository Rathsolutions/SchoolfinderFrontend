//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { ToastrService } from 'ngx-toastr';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const BASE_URL = environment.baseUrl;

export class BaseService<T> {
  protected username = null;
  protected password = null;
  protected static loggedIn = false;

  private static HTTP_OPTIONS = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  protected getCredentialHttpOptionsAndCheckConsent() {
    if (!this.ccService.hasConsented()) {
      this.toastrService.error("Sie müssen technische Cookies akzeptieren, um diese Funktion zu nutzen!")
      return null;
    }
    return BaseService.HTTP_OPTIONS;
  }

  protected setUserAndPassword(username: string, password: string) {
    this.username = username;
    this.password = password;
    BaseService.HTTP_OPTIONS = {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.username + ':' + this.password),
        'X-XSRF-TOKEN': this.cookieService.get("XSRF-TOKEN")

      })
    };
  }

  protected requestURL = BASE_URL;

  constructor(
    protected http: HttpClient,
    protected cookieService: CookieService,
    private ccService: NgcCookieConsentService,
    private toastrService: ToastrService,
    protected entity
  ) {
    this.requestURL = BASE_URL + entity;
  }

  protected handleError(operation = 'operation') {
    return (error: any): Observable<T> => {

      console.error(error);
      return throwError(error);
    };
  }

  protected handleNumberError(operation = 'operation') {
    return (error: any): Observable<number> => {
      console.error(error);
      return throwError(error);
    };
  }

  protected handleListError(operation = 'operation') {
    return (error: any): Observable<T[]> => {
      console.error(error);
      return throwError(error);
    };
  }

  public findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.requestURL + "/search/findAll", BaseService.HTTP_OPTIONS)
      .pipe(
        catchError(this.handleListError(this.entity + ':findAll'))
      );
  }

  public create(t: T): Observable<T> {
    return this.http.put<T>(this.requestURL + '/create', t, BaseService.HTTP_OPTIONS)
      .pipe(
        catchError(this.handleError(this.entity + ':create'))
      );
  }

  public read(id: number): Observable<T> {
    return this.http.get<T>(this.requestURL + '/' + id, BaseService.HTTP_OPTIONS)
      .pipe(
        catchError(this.handleError(this.entity + ':read'))
      );
  }

  public update(t: T): Observable<T> {
    return this.http.patch<T>(this.requestURL + '/edit', t, BaseService.HTTP_OPTIONS)
      .pipe(
        catchError(this.handleError(this.entity + ':update'))
      );
  }

  public delete(id: number): Observable<T> {
    return this.http.delete<T>(this.requestURL + '/delete/' + id, BaseService.HTTP_OPTIONS)
      .pipe(
        catchError(this.handleError(this.entity + ':delete'))
      );
  }
  public static isLoggedIn() {
    return this.loggedIn;
  }
}
