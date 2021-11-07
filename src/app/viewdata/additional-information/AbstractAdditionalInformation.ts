//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Directive } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AdditionalInformationDTO } from "src/app/entities/AdditionalInformationEntity";
import { AdditionalInformationService } from "src/app/services/additional-information.service";

export interface AbstractAdditionalInformation {
  resetValues(): void;
  toAdditionalInformationEntity(): AdditionalInformationDTO;
  prefill(dto: AdditionalInformationDTO): void;
}
