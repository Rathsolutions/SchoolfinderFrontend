import { Observable, of } from "rxjs";
import { BaseService } from "../base.service";
import { PersistStrategy } from "./PersistStrategy";

export class DummyStrategy implements PersistStrategy<any> {
  setServiceInstance(service: BaseService<any>) {}
  persist(objToPersist: any): Observable<any> {
    return of();
  }
}
