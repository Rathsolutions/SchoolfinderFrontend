//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Directive } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AdditionalInformationEntity } from "src/app/entities/AdditionalInformationEntity";
import { AdditionalInformationService } from "src/app/services/additional-information.service";

@Directive()
export abstract class AbstractAdditionalInformation {
  collapsedHeight = "50px";
  value: FormControl = new FormControl("", Validators.required);
  type: FormControl = new FormControl("", Validators.required);

  newPointForm: FormGroup;

  constructor(
    protected additionalInformationService: AdditionalInformationService
  ) {}

  public prefill(additionalInformationEntity: AdditionalInformationEntity) {
    this.value.setValue(additionalInformationEntity.value);
    this.type.setValue(additionalInformationEntity.type);
  }

  public setNewPointForm(newPointForm: FormGroup) {
    this.newPointForm = newPointForm;
  }

  public resetValues(): void {
    this.value.reset();
    this.type.reset();
  }

  public toAdditionalInformationEntity(): AdditionalInformationEntity {
    var entity = new AdditionalInformationEntity();
    entity.type = this.type.value;
    entity.value = this.value.value;
    return entity;
  }

  public isFilled(): boolean {
    return this.type.status === "VALID" && this.value.status === "VALID";
  }

  public isAtLeastOneFilled(): boolean {
    return this.type.value || this.value.value;
  }
}
