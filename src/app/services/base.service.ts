//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders, HttpParams, HttpXsrfTokenExtractor } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { ToastrService } from 'ngx-toastr';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Globals } from '../util/globals';

const BASE_URL = environment.baseUrl;

export class BaseService<T> {
  protected static username = null;
  protected static password = null;
  protected static loggedIn = false;
  private authHeader = null;

  static HTTP_OPTIONS = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  protected getCredentialHttpOptionsAndCheckConsent() {
    var csrf = this.cookieService.get("XSRF-TOKEN");
    if (csrf && BaseService.loggedIn) {
      BaseService.HTTP_OPTIONS = {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(BaseService.username + ':' + BaseService.password),
          'X-XSRF-TOKEN': this.cookieService.get("XSRF-TOKEN")
        })
      };
    }
    if (!this.ccService.hasConsented()) {
      this.ccService.open();
      this.toastrService.error("Sie müssen technische Cookies akzeptieren, um diese Funktion zu nutzen!")
      return null;
    }
    return BaseService.HTTP_OPTIONS;
  }

  protected setUserAndPassword(username: string, password: string) {
    BaseService.username = username;
    BaseService.password = password;
    BaseService.HTTP_OPTIONS = {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(BaseService.username + ':' + BaseService.password),
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

  protected buildParams(params: {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  }) {
    var parm = new HttpParams();
    parm = parm.appendAll(params)
    if (Globals.activeProject) {
      parm = parm.append(
        "projectId", Globals.activeProject
      )
    }
    return parm;
  }

  public findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.requestURL + "/search/findAll", BaseService.HTTP_OPTIONS)
      .pipe(
        catchError(this.handleListError(this.entity + ':findAll'))
      );
  }

  public create(t: T): Observable<T> {
    return this.http.put<T>(this.requestURL + '/create', t, this.getCredentialHttpOptionsAndCheckConsent())
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
    return this.http.patch<T>(this.requestURL + '/edit', t, this.getCredentialHttpOptionsAndCheckConsent())
      .pipe(
        catchError(this.handleError(this.entity + ':update'))
      );
  }

  public delete(id: number): Observable<T> {
    return this.http.delete<T>(this.requestURL + '/delete/' + id, this.getCredentialHttpOptionsAndCheckConsent())
      .pipe(
        catchError(this.handleError(this.entity + ':delete'))
      );
  }
  public static isLoggedIn() {
    return this.loggedIn;
  }
}
