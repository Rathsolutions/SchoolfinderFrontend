//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { PersonEntity } from './PersonEntity';

export class PersonFunctionalityEntity {
    mappingId:number
    functionality: PersonFunctionality;
    person: PersonEntity;

    public constructor(mappingId:number,functionality: PersonFunctionality, person: PersonEntity) {
        this.mappingId = mappingId;
        this.functionality = functionality;
        this.person = person;
    }

}

export enum PersonFunctionality {
    XR = "XR",
    MAKERSPACE = "MAKERSPACE"
}