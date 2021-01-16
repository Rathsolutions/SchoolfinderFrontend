//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { UserEntity } from '../entities/UserEntity';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserEntity> {
  constructor(
    http: HttpClient, protected tokenExtractor: HttpXsrfTokenExtractor) {
    super(http, "users", tokenExtractor);
  }

  public login(username: string, password: string): Observable<UserEntity> {
    this.setUserAndPassword(username, password);
    return this.http.get<UserEntity>(this.requestURL + "/validateCredentials", BaseService.HTTP_OPTIONS).pipe(tap(e => {
      BaseService.loggedIn = true;
    }))
      .pipe(catchError(this.handleError(this.entity + ':validateCredentials'))
      );
  }

  public logout() {
    BaseService.loggedIn = false;
  }
}
