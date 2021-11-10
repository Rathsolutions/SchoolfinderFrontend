//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { PersonFunctionalityEntity } from "./PersonFunctionalityEntity";
import { CriteriaEntity } from "./CriteriaEntity";
import { ProjectCategoryEntity } from "./ProjectEntity";
import { AdditionalInformationDTO } from "./AdditionalInformationEntity";

export class SchoolPersonEntity {
  id: number;
  imageIcon: string;
  shortSchoolName: string;
  schoolName: string;
  schoolPicture: string;
  alternativePictureText: string;
  latitude: number;
  longitude: number;
  personSchoolMapping: PersonFunctionalityEntity[] = [];
  matchingCriterias: CriteriaEntity[] = [];
  projects: ProjectCategoryEntity[] = [];
  primaryProject: ProjectCategoryEntity;
  correspondingAreaName: string;
  additionalInformation: AdditionalInformationDTO[] = [];
  schoolType: string;
  address: string;
  generalPhoneNumber: string;
  generalEmail: string;
  homepage: string;
}
