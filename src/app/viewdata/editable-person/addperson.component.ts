//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { AbstractPersonViewData } from "../AbstractPersonViewData";
import { PersonsService } from "../../services/persons.service";
import { PersonFunctionalityEntity } from "src/app/entities/PersonFunctionalityEntity";
import { ToastrService } from "ngx-toastr";
import { PersonEntity } from "src/app/entities/PersonEntity";
import { Component } from "@angular/core";
import { FunctionalityService } from "src/app/services/functionality.service";
import { Subject } from "rxjs";
import { RemoveableComponent } from "../RemoveableComponent";

@Component({
  selector: "addperson-overlay-component",
  templateUrl: "./addperson.component.html",
  styleUrls: ["./addperson.component.css"],
})
export class AddPersonComponent extends AbstractPersonViewData implements RemoveableComponent{
  functionalityName: string = "Auszufüllende";
  private removeListener: Subject<AddPersonComponent> = new Subject();
  constructor(
    protected personsService: PersonsService,
    private toastr: ToastrService,
    private functionalityService: FunctionalityService
  ) {
    super(personsService);
    this.email.valueChanges.subscribe((data) => {
      this.updateEmailCache(data);
    });
    this.functionality.valueChanges.subscribe((data) => {
      this.functionalityName = data;
    });
    this.functionalityService.findAll().subscribe((res) => {
      res.forEach((e) => this.functionalities.push(e));
    });
  }
  onRemove(): Subject<any> {
    return this.removeListener;
  }

  public personCategoryOpened(): void {
    this.functionalityService.findAll().subscribe((res) => {
      res.forEach((e) => {
        if (!this.functionalities.some((f) => f.id == e.id)) {
          this.functionalities.push(e);
        }else if(this.functionalities.some((f) => f.id == e.id && f.name != e.name)){
          this.functionalities.find((f) => f.id == e.id).name = e.name;
        }
      });
    });
  }

  public removePersonFromSchool() {
    this.removeListener.next(this);
  }

  public emailClicked() {
    this.updateEmailCache("");
  }

  protected updateEmailCache(data: string): void {
    this.personsService
      .getNextPossibleEmails(this.prename.value, this.lastname.value, data, 5)
      .subscribe((result) => {
        this.emails = [];
        result.forEach((e) => this.emails.push(e.email));
      });
  }
  public async getOrInsertPerson(): Promise<PersonFunctionalityEntity> {
    var errorInCallback = false;
    var personFunctionalityEntity = this.toPersonFunctionalityEntity();
    if (this && this.isFilled()) {
      var toReturn;
      var personNotExisting = false;
      await this.getPersonFromBackend(personFunctionalityEntity.person)
        .then((result) => (toReturn = result))
        .catch((err) => {
          if (err.status == 404) {
            personNotExisting = true;
          } else if (err.status == 400) {
            this.toastr.error(
              "Die E-Mail Adresse einer Person stimmt nicht mit den bereits gespeicherten Angaben von Vor - und Nachnahmen sowie Telefonnummer überein!"
            );
            errorInCallback = true;
          }
        });
      if (personNotExisting) {
        await this.persistPerson(personFunctionalityEntity.person)
          .then((result) => (toReturn = result))
          .catch((err) => {
            if (err.status == 400) {
              this.toastr.error(
                "Die E-Mail Adresse einer Person stimmt nicht mit den bereits gespeicherten Angaben von Vor - und Nachnahmen sowie Telefonnummer überein!"
              );
              errorInCallback = true;
            }
          });
      }
      if (errorInCallback) {
        return new Promise<PersonFunctionalityEntity>((resolve, reject) => {
          reject(true);
        });
      }
      return new Promise<PersonFunctionalityEntity>((resolve, reject) => {
        if (!errorInCallback) {
          personFunctionalityEntity.person = toReturn;
          resolve(personFunctionalityEntity);
        } else {
          reject(true);
        }
      });
    } else {
      return new Promise<PersonFunctionalityEntity>((resolve, reject) => {
        reject("Bitte die Person vollständig ausfüllen!");
      });
    }
  }
  private async getPersonFromBackend(
    person: PersonEntity
  ): Promise<PersonEntity> {
    var personFromDb = this.personsService
      .getPerson(person.prename, person.lastname, person.email, person.phoneNumber)
      .toPromise();
    return personFromDb;
  }
  private async persistPerson(person: PersonEntity): Promise<PersonEntity> {
    var personFromDb = this.personsService.putNewPerson(person).toPromise();
    return personFromDb;
  }
}
