import { Observable } from "rxjs";
import { BaseService } from "../base.service";
import { PersistStrategy } from "./PersistStrategy";

export class EditStrategy<T> implements PersistStrategy<T> {
  constructor(private service: BaseService<T>) {}
  persist(objToPersist: T): Observable<T> {
    return this.service.update(objToPersist);
  }
}
