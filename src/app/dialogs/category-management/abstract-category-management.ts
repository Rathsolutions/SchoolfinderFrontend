import { Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";

export abstract class AbstractCategoryManagement<
  ManagementComponent,
  ComponentData extends { persistStrategy: PersistStrategy<any> }
> {
  protected persistStrategy: PersistStrategy<any>;
  constructor(
    public dialogRef: MatDialogRef<ManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComponentData,
    private calculationEventService: CalculationEventService,
    private toastrService: ToastrService
  ) {
    this.persistStrategy = data.persistStrategy;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(entityToPersist: any): void {
    this.calculationEventService.emit(true);
    this.persistStrategy.persist(entityToPersist).subscribe(
      (res) => {
        this.calculationEventService.emit(false);
        this.dialogRef.close(res);
      },
      (rej) => {
        this.calculationEventService.emit(false);
        this.toastrService.error(
          "Bei der Erstellung ist ein Fehler aufgetreten! Bitte überprüfen Sie alle eingetragenen Werte"
        );
      }
    );
  }
}
