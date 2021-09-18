import { Observable } from "rxjs";
import { BaseService } from "../base.service";

export interface PersistStrategy<T>{
    persist(objToPersist:T):Observable<T>;
    setServiceInstance(service:BaseService<T>);
}