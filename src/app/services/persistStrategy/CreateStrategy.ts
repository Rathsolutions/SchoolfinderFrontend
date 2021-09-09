import { Observable } from "rxjs";
import { BaseService } from "../base.service";
import { PersistStrategy } from "./PersistStrategy";

export class CreateStrategy<T> implements PersistStrategy<T> {
  constructor(private service: BaseService<T>) {}
  persist(objToPersist: T): Observable<T> {
    return this.service.create(objToPersist);
  }
}
