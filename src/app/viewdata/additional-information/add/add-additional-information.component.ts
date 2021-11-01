//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { PersonFunctionalityEntity } from "src/app/entities/PersonFunctionalityEntity";
import { ToastrService } from "ngx-toastr";
import { PersonEntity } from "src/app/entities/PersonEntity";
import { Component } from "@angular/core";
import { FunctionalityService } from "src/app/services/functionality.service";
import { Subject } from "rxjs";
import { AbstractAdditionalInformation } from "../AbstractAdditionalInformation";
import { AdditionalInformationService } from "src/app/services/additional-information.service";

@Component({
  selector: "add-additional-information-component",
  templateUrl: "./add-additional-information.component.html",
  styleUrls: ["./add-additional-information.component.css"],
})
export class AddAdditionalInformation extends AbstractAdditionalInformation {
  informationTypes: String[];

  removeListener: Subject<AddAdditionalInformation> = new Subject();

  constructor(additionalInformationService: AdditionalInformationService) {
    super(additionalInformationService);
    additionalInformationService
      .findAllTypes()
      .toPromise()
      .then((res) => {
        this.informationTypes = res;
      });
  }

  public typeOpened() {}

  public removeFromSchool() {
    this.removeListener.next(this);
  }
}
