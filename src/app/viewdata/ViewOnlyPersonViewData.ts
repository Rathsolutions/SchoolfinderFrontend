//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { AbstractPersonViewData } from './AbstractPersonViewData';
export class ViewOnlyPersonViewData extends AbstractPersonViewData {
    public emailClicked() {
        throw new Error("This is the read only variant of person view data!");
    } protected updateEmailCache(data: string): void {
        throw new Error("This is the read only variant of person view data!");
    }
}