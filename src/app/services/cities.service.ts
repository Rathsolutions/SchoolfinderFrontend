//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CriteriaEntity } from '../entities/CriteriaEntity';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OsmPOIEntity } from '../entities/OsmPOIEntity';
@Injectable({
    providedIn: 'root'
})
export class CitiesService extends BaseService<CriteriaEntity> {
    constructor(
        http: HttpClient) {
        super(http, "cities");
    }

    public searchCityInOsmFile(cityname: string, amount:number): Observable<OsmPOIEntity[]> {
        return this.http.get<OsmPOIEntity[]>(this.requestURL + "/search/findCityByName", {
            params: {
                name: cityname,
                amount: amount.toString()
            }
        });
    }

    public searchCityAndStreetInOsmFile(cityname:string, street:string, housenumber:string, amount:number): Observable<OsmPOIEntity[]>{
        return this.http.get<OsmPOIEntity[]>(this.requestURL + "/search/findCityStreetPositionByName", {
            params: {
                city: cityname,
                street: street,
                housenumber: housenumber,
                amount: amount.toString()
            }
        });
    }
}
