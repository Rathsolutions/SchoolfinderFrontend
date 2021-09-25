import { Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
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
    toastrService: ToastrService,
    mapEventService: MapUpdateEventService
  ) {
    super(
      calculationEventService,
      toastrService,
      data.persistStrategy,
      mapEventService
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  protected async saveChanges(entityToPersist: any) {
    super.saveChanges(entityToPersist).then((res) => {
      this.dialogRef.close(entityToPersist);
      return Promise.resolve(res);
    }).catch(rej=>{
      return Promise.reject(rej);
    });
  }
}
