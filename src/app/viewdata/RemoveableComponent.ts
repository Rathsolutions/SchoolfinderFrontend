import { Subject } from "rxjs";

export interface RemoveableComponent{
    onRemove():Subject<any>;
}