//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { AbstractPersonViewData } from './AbstractPersonViewData';
import { PersonsService } from '../services/persons.service';
export class EditablePersonViewData extends AbstractPersonViewData {

    constructor(protected personsService: PersonsService) {
        super(personsService);
        this.email.valueChanges.subscribe(data => {
            this.updateEmailCache(data);
        });
    }

    public emailClicked() {
        this.updateEmailCache('');
    }

    protected updateEmailCache(data: string): void {
        this.personsService.getNextPossibleEmails(this.prename.value, this.lastname.value, data, 5).subscribe(result => {
            this.emails = [];
            result.forEach(e => this.emails.push(e.email));
        });
    }
}