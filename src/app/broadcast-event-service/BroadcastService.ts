import { Observable } from "rxjs";

export interface BroadcastService<T> {
  register(): Observable<T>;
  emit(eventMessage: T): void;
}
