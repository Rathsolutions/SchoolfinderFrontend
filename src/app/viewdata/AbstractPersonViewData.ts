//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Directive } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { FunctionalityEntity } from "../entities/FunctionalityEntity";
import { PersonEntity } from "../entities/PersonEntity";
import { PersonFunctionalityEntity } from "../entities/PersonFunctionalityEntity";
import { PersonsService } from "../services/persons.service";

@Directive()
export abstract class AbstractPersonViewData {
  collapsedHeight = "50px";
  prename: FormControl = new FormControl("", Validators.required);
  functionality: FormControl = new FormControl("", Validators.required);
  institutionalFunctionality: FormControl = new FormControl("");
  lastname: FormControl = new FormControl("", Validators.required);
  email: FormControl = new FormControl("", [
    Validators.email,
  ]);
  phonenumber: FormControl = new FormControl("");
  projectDescription: FormControl = new FormControl("");

  newPointForm: FormGroup;

  emails: string[] = [];
  functionalities: FunctionalityEntity[] = [];

  constructor(protected personsService: PersonsService) { }

  public prefill(personFunctionalityEntity: PersonFunctionalityEntity) {
    var person = personFunctionalityEntity.person;
    this.functionality.setValue(personFunctionalityEntity.functionality.name);
    this.institutionalFunctionality.setValue(personFunctionalityEntity.institutionalFunctionality);
    this.prename.setValue(person.prename);
    this.lastname.setValue(person.lastname);
    this.email.setValue(person.email);
    this.phonenumber.setValue(person.phoneNumber);
    this.projectDescription.setValue(personFunctionalityEntity.description);
  }

  public setNewPointForm(newPointForm: FormGroup) {
    this.newPointForm = newPointForm;
  }

  public autocompleteChoosen(value) {
    this.personsService.getPerson("", "", value, "").subscribe(
      (result) => {
        this.phonenumber.setValue(result.phoneNumber);
        this.newPointForm.patchValue({ phonenumber: result.phoneNumber });
      },
      (error) => console.log(error)
    );
  }

  public abstract emailClicked();

  protected abstract updateEmailCache(data: string): void;

  public resetValues(): void {
    this.prename.reset();
    this.lastname.reset();
    this.institutionalFunctionality.reset();
    this.email.reset();
    this.phonenumber.reset();
    this.projectDescription.reset();
    this.emails = [];
    this.functionalities = [];
  }

  public toPersonFunctionalityEntity(): PersonFunctionalityEntity {
    var person = new PersonEntity();
    person.prename = this.prename.value;
    person.lastname = this.lastname.value;
    person.email = this.email.value;
    person.phoneNumber = this.phonenumber.value;
    var functionalityEntity = new FunctionalityEntity();
    functionalityEntity.name = this.functionality.value;
    var personFunctionalityEntity = new PersonFunctionalityEntity(
      -1,
      functionalityEntity,
      person,
      this.projectDescription.value
    );
    personFunctionalityEntity.institutionalFunctionality = this.institutionalFunctionality.value;
    return personFunctionalityEntity;
  }

  public isFilled(): boolean {
    return (
      this.prename.status === "VALID" &&
      this.lastname.status === "VALID" &&
      this.functionality.status === "VALID" &&
      this.prename.value !== "" &&
      this.lastname.value !== "" &&
      this.functionality.value !== ""
    );
  }

  public isAtLeastOneFilled(): boolean {
    return this.prename.value || this.lastname.value || this.email.value;
  }
}
