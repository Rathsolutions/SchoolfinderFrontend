import { Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
import { MapUpdateEventService } from "../broadcast-event-service/MapUpdateEventService";

export abstract class SavableComponent {
  protected persistStrategy: PersistStrategy<any>;
  constructor(
    protected calculationEventService: CalculationEventService,
    protected toastrService: ToastrService,
    persistStrategy:PersistStrategy<any>,
    protected mapEventService:MapUpdateEventService
  ) {
    this.persistStrategy = persistStrategy;
  }

  protected async saveChanges(entityToPersist: any) {
    this.calculationEventService.emit(true);
    this.persistStrategy.persist(entityToPersist).subscribe(
      (res) => {
        this.calculationEventService.emit(false);
        this.mapEventService.emit(true);
        return Promise.resolve(res);
      },
      (rej) => {
        this.calculationEventService.emit(false);
        this.toastrService.error(
          "Bei der Erstellung ist ein Fehler aufgetreten! Bitte überprüfen Sie alle eingetragenen Werte"
        );
        return Promise.reject(rej);
      }
    );
  }
}
