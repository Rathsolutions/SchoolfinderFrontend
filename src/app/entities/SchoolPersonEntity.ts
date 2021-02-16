//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { PersonFunctionalityEntity } from './PersonFunctionalityEntity';
import { CriteriaEntity } from './CriteriaEntity';

export class SchoolPersonEntity {
    id: number;
    schoolName: string;
    schoolPicture:string;
    color:string;
    arContent:string;
    makerspaceContent:string;
    latitude: number;
    longitude: number;
    personSchoolMapping: PersonFunctionalityEntity[] = [];
    matchingCriterias: CriteriaEntity[] = [];
}
