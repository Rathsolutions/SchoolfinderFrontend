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
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "add-additional-information-component",
  templateUrl: "./add-additional-information.component.html",
  styleUrls: ["./add-additional-information.component.css"],
})
export class AddAdditionalInformation
  implements RemoveableComponent, AbstractAdditionalInformation
{
  collapsedHeight = "50px";

  informationTypes: InformationType[];

  value: FormControl = new FormControl("", Validators.required);
  type: FormControl = new FormControl("", Validators.required);
  homepage: FormControl = new FormControl("");

  newPointForm: FormGroup;
  private removeListener: Subject<AddAdditionalInformation> = new Subject();

  constructor(
    additionalInformationService: AdditionalInformationService,
    private informationTypeService: InformationTypeService
  ) {
    informationTypeService
      .findAll()
      .toPromise()
      .then((res) => {
        this.informationTypes = res;
      });
  }
  onRemove(): Subject<AddAdditionalInformation> {
    return this.removeListener;
  }

  public typeOpened() {
    this.informationTypeService.findAll().subscribe((res) => {
      res.forEach((e) => {
        if (!this.informationTypes.some((f) => f.id == e.id)) {
          this.informationTypes.push(e);
        } else if (
          this.informationTypes.some((f) => f.id == e.id && f.name != e.name)
        ) {
          this.informationTypes.find((f) => f.id == e.id).name = e.name;
        }
      });
    });
  }

  public prefill(additionalInformationEntity: AdditionalInformationDTO) {
    this.value.setValue(additionalInformationEntity.value);
    this.type.setValue(additionalInformationEntity.type);
    this.homepage.setValue(additionalInformationEntity.homepage);
  }

  public setNewPointForm(newPointForm: FormGroup) {
    this.newPointForm = newPointForm;
  }

  public resetValues(): void {
    this.value.reset();
    this.type.reset();
    this.homepage.reset();
  }

  public toAdditionalInformationEntity(): AdditionalInformationDTO {
    var entity = new AdditionalInformationDTO();
    entity.type = this.type.value;
    entity.value = this.value.value;
    entity.homepage = this.homepage.value;
    return entity;
  }

  public isFilled(): boolean {
    return this.type.status === "VALID" && this.value.status === "VALID";
  }

  public isAtLeastOneFilled(): boolean {
    return this.type.value || this.value.value;
  }

  public removeFromSchool() {
    this.removeListener.next(this);
  }
}
