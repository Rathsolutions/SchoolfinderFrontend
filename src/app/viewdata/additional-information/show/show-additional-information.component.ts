//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { PersonFunctionalityEntity } from "src/app/entities/PersonFunctionalityEntity";
import { ToastrService } from "ngx-toastr";
import { PersonEntity } from "src/app/entities/PersonEntity";
import { Component } from "@angular/core";
import { FunctionalityService } from "src/app/services/functionality.service";
import { Subject } from "rxjs";
import { AbstractAdditionalInformation } from "../AbstractAdditionalInformation";
import { AdditionalInformationService } from "src/app/services/additional-information.service";
import { RemoveableComponent } from "../../RemoveableComponent";
import { AdditionalInformationDTO } from "src/app/entities/AdditionalInformationEntity";
import { InformationTypeService } from "src/app/services/information-type.service";
import { InformationType } from "src/app/entities/InformationType";

@Component({
  selector: "show-additional-information-component",
  templateUrl: "./show-additional-information.component.html",
  styleUrls: ["./show-additional-information.component.css"],
})
export class ShowAdditionalInformation
  implements AbstractAdditionalInformation
{
  collapsedHeight = "50px";
  contentMap: Map<string, string[]>;
  constructor(
    additionalInformationService: AdditionalInformationService,
    private informationTypeService: InformationTypeService
  ) {
    this.contentMap = new Map();
  }
  resetValues(): void {
    this.contentMap = new Map();
  }
  toAdditionalInformationEntity(): AdditionalInformationDTO {
    throw new Error("Method not implemented.");
  }
  prefill(dto: AdditionalInformationDTO): void {
    if (!this.contentMap.has(dto.type)) {
      this.contentMap.set(dto.type, []);
    }
    this.contentMap.get(dto.type).push(dto.value);
  }
}
