import { Observable, of } from "rxjs";
import { PersistStrategy } from "./PersistStrategy";

export class DummyStrategy implements PersistStrategy<any>{
    persist(objToPersist: any): Observable<any> {
        return of();
    }

}