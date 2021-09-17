//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { AbstractPersonViewData } from "../AbstractPersonViewData";
import { PersonsService } from "../../services/persons.service";
import { PersonFunctionalityEntity } from "src/app/entities/PersonFunctionalityEntity";
import { ToastrService } from "ngx-toastr";
import { PersonEntity } from "src/app/entities/PersonEntity";
import { Component } from "@angular/core";
import { FunctionalityService } from "src/app/services/functionality.service";

@Component({
  selector: "addperson-overlay-component",
  templateUrl: "./addperson.component.html",
  styleUrls: ["./addperson.component.css"],
})
export class AddPersonComponent extends AbstractPersonViewData {
  functionalityName: string = "Auszufüllende";

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
      res.forEach((e) => this.functionalities.push(e.name));
    });
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
  //TODO implement field for adding functionality to the person. without, we´ll always get an persist exception.
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
      .getPerson(person.prename, person.lastname, person.email)
      .toPromise();
    return personFromDb;
  }
  private async persistPerson(person: PersonEntity): Promise<PersonEntity> {
    var personFromDb = this.personsService.putNewPerson(person).toPromise();
    return personFromDb;
  }
}
