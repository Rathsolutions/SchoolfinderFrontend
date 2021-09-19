//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { FunctionalityEntity } from './FunctionalityEntity';
import { PersonEntity } from './PersonEntity';

export class PersonFunctionalityEntity {
    mappingId:number
    functionality: FunctionalityEntity;
    person: PersonEntity;
    description:string;

    public constructor(mappingId:number,functionality: FunctionalityEntity, person: PersonEntity, description:string) {
        this.mappingId = mappingId;
        this.functionality = functionality;
        this.person = person;
        this.description = description;
    }

}

export enum PersonFunctionality {
    XR = "XR",
    MAKERSPACE = "MAKERSPACE"
}