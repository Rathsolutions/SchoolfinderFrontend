//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component } from "@angular/core";
import { AbstractPersonViewData } from "../AbstractPersonViewData";
@Component({
  selector: "showperson-overlay-component",
  templateUrl: "./showperson.component.html",
  styleUrls: ["./showperson.component.css"],
})
export class ShowPersonComponent extends AbstractPersonViewData {

  public getProjectDescription():string{
    if(this.projectDescription.value){
      return this.projectDescription.value;
    }else{
      return "Für weitere Informationen kontaktieren Sie bitte die oben angegebene Ansprechperson!"
    }
  }

  public emailClicked() {
    throw new Error("This is the read only variant of person view data!");
  }
  protected updateEmailCache(data: string): void {
    throw new Error("This is the read only variant of person view data!");
  }
}
