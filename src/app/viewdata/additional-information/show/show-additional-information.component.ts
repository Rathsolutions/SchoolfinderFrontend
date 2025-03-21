//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component } from "@angular/core";
import { AbstractAdditionalInformation } from "../AbstractAdditionalInformation";
import { AdditionalInformationDTO } from "src/app/entities/AdditionalInformationEntity";
import { InformationTypeService } from "src/app/services/information-type.service";
import { SchoolPersonEntity } from "src/app/entities/SchoolPersonEntity";
import { UrlUtils } from "../../../util/url-utils";

@Component({
    selector: "show-additional-information-component",
    templateUrl: "./show-additional-information.component.html",
    styleUrls: ["./show-additional-information.component.css"],
    standalone: false
})
export class ShowAdditionalInformation
  implements AbstractAdditionalInformation {
  collapsedHeight = "50px";
  contentMap: Map<string, AdditionalInformationDTO[]>;
  correspondingSchoolEntity: SchoolPersonEntity;
  constructor(
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
  prefillGeneralInformation(dto: SchoolPersonEntity): void {
    this.correspondingSchoolEntity = dto;
  }
  prefill(dto: AdditionalInformationDTO): void {
    if (!this.contentMap.has(dto.type)) {
      this.contentMap.set(dto.type, []);
    }
    this.contentMap.get(dto.type).push(dto);
  }
  convertToValidUrl(url: string): string {
    return UrlUtils.convertToValidUrl(url);
  }
  isUrl(possibleUrl: string): boolean {
    return UrlUtils.isUrl(possibleUrl);
  }

  deserializeEmail(email:string):string{
    return UrlUtils.deserializeEmail(email);
  }

  formatEmailToLink(email: string): string {
    return UrlUtils.formatEmailToLink(email);
  }

  isStringEmail(possibleEmail:string):boolean{
    return UrlUtils.isStringEmail(possibleEmail);
  }

  generateEmailList(email: string): string[] {
    return UrlUtils.splitEmailsIntoSingleList(email);
  }
}
