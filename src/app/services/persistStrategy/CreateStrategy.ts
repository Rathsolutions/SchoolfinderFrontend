import { Observable } from "rxjs";
import { BaseService } from "../base.service";
import { PersistStrategy } from "./PersistStrategy";

export class CreateStrategy<T> implements PersistStrategy<T> {
  private service: BaseService<T>;
  setServiceInstance(service: BaseService<T>) {
    this.service = service;
  }
  persist(objToPersist: T): Observable<T> {
    return this.service.create(objToPersist);
  }
}
