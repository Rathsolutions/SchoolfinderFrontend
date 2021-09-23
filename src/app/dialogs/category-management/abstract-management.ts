import { Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { SavableComponent } from "src/app/overlay/SaveableComponent";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";

export abstract class AbstractManagement<
  ManagementComponent,
  ComponentData extends { persistStrategy: PersistStrategy<any> }
> extends SavableComponent {
  protected persistStrategy: PersistStrategy<any>;
  constructor(
    public dialogRef: MatDialogRef<ManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComponentData,
    calculationEventService: CalculationEventService,
    toastrService: ToastrService
  ) {
    super(calculationEventService,toastrService,data.persistStrategy);
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
