import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CalculationEventService } from "src/app/broadcast-event-service/CalculationEventService";
import { MapUpdateEventService } from "src/app/broadcast-event-service/MapUpdateEventService";
import { AdditionalInformationEntity } from "src/app/entities/AdditionalInformationEntity";
import { FunctionalityEntity } from "src/app/entities/FunctionalityEntity";
import { InformationType } from "src/app/entities/InformationType";
import { AdditionalInformationService } from "src/app/services/additional-information.service";
import { InformationTypeService } from "src/app/services/information-type.service";
import { PersistStrategy } from "src/app/services/persistStrategy/PersistStrategy";
import { AbstractManagement } from "../abstract-management";

@Component({
  selector: "app-additional-category-management-component",
  templateUrl: "./additional-category-management-component.component.html",
  styleUrls: ["./additional-category-management-component.component.css"],
})
export class AdditionalCategoryManagementComponentComponent
  extends AbstractManagement<
    AdditionalCategoryManagementComponentComponent,
    AdditionalCategoryManagementData
  >
  implements OnInit
{
  constructor(
    dialogRef: MatDialogRef<AdditionalCategoryManagementComponentComponent>,
    @Inject(MAT_DIALOG_DATA) data: AdditionalCategoryManagementData,
    calculationEventService: CalculationEventService,
    informationTypeService: InformationTypeService,
    toastrService: ToastrService,
    mapEventService: MapUpdateEventService
  ) {
    super(
      dialogRef,
      data,
      calculationEventService,
      toastrService,
      mapEventService
    );
    this.persistStrategy.setServiceInstance(informationTypeService);
  }

  ngOnInit(): void {}
  async saveChanges() {
    var functionalityEntity = new InformationType();
    functionalityEntity.id = this.data.id;
    functionalityEntity.name = this.data.name;
    super.saveChanges(functionalityEntity);
  }
}
export interface AdditionalCategoryManagementData {
  name: string;
  id: number;
  adminNotice: string;
  persistStrategy: PersistStrategy<FunctionalityEntity>;
}
