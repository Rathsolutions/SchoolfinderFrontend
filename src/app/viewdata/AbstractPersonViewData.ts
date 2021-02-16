//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonEntity } from '../entities/PersonEntity';
import { PersonsService } from '../services/persons.service';

export abstract class AbstractPersonViewData {
    prename: FormControl = new FormControl('', Validators.required);
    lastname: FormControl = new FormControl('', Validators.required);
    email: FormControl = new FormControl('', [Validators.required, Validators.email]);
    phonenumber: FormControl = new FormControl('');

    newPointForm: FormGroup;

    emails: string[] = [];

    constructor(protected personsService: PersonsService) {
    }

    public prefill(person: PersonEntity) {
        this.prename.setValue(person.prename);
        this.lastname.setValue(person.lastname);
        this.email.setValue(person.email);
        this.phonenumber.setValue(person.phoneNumber);
    }

    public setNewPointForm(newPointForm: FormGroup) {
        this.newPointForm = newPointForm;
    }

    public autocompleteChoosen(value) {
        this.personsService.getPerson('', '', value).subscribe(result => {
            this.phonenumber.setValue(result.phoneNumber);
            this.newPointForm.patchValue({ phonenumber: result.phoneNumber });
        }, error => console.log(error));
    }

    public abstract emailClicked();

    protected abstract updateEmailCache(data: string): void;

    public resetValues(): void {
        this.prename.reset();
        this.lastname.reset();
        this.email.reset();
        this.phonenumber.reset();
        this.emails = [];
    }

    public toPersonEntity(): PersonEntity {
        var person = new PersonEntity();
        person.prename = this.prename.value;
        person.lastname = this.lastname.value;
        person.email = this.email.value;
        person.phoneNumber = this.phonenumber.value;
        return person;
    }

    public isFilled(): boolean {
        return this.prename.status === 'VALID' && this.lastname.status === 'VALID' && this.email.status === 'VALID' && this.prename.value !== "" && this.lastname.value !== "" && this.email.value !== "";
    }

    public isAtLeastOneFilled(): boolean {
        return this.prename.value || this.lastname.value || this.email.value;
    }
}