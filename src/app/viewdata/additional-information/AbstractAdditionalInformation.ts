//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { AdditionalInformationDTO } from "src/app/entities/AdditionalInformationEntity";

export interface AbstractAdditionalInformation {
  resetValues(): void;
  toAdditionalInformationEntity(): AdditionalInformationDTO;
  prefill(dto: AdditionalInformationDTO): void;
}
