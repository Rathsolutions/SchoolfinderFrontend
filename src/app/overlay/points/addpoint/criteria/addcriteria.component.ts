//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import {
  Component,
  Type,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Inject,
  OnInit,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { CriteriaEntity } from "src/app/entities/CriteriaEntity";
import { RemoveableComponent } from "src/app/viewdata/RemoveableComponent";

import { CriteriaService } from "../../../../services/criteria.service";
import { AddPointOverlay } from "../addpointoverlay.component";

@Component({
  selector: "addcriteria-component",
  templateUrl: "./addcriteria.component.html",
  styleUrls: ["./addcriteria.component.css"],
})
export class AddCriteriaComponent implements RemoveableComponent {
  criteriaName: FormControl = new FormControl("");
  newPointForm: FormGroup;
  possibleCriterias: string[] = [];

  private removeListener: Subject<AddCriteriaComponent> = new Subject();

  collapsedHeight = "5vh";

  constructor(private criteriaService: CriteriaService) {
    this.criteriaName.valueChanges.subscribe((data) => {
      this.updateCriteriaCache(data);
    });
  }
  onRemove(): Subject<any> {
    return this.removeListener;
  }

  public toCriteriaEntity(): CriteriaEntity {
    var entity = new CriteriaEntity();
    entity.criteriaName = this.criteriaName.value;
    return entity;
  }

  public removeCriteriaFromSchool() {
    this.removeListener.next(this);
  }

  public setNewPointForm(newPointForm: FormGroup) {
    this.newPointForm = newPointForm;
  }

  public autocompleteChoosen(value) {}

  public criteriaClicked() {
    this.updateCriteriaCache("");
  }

  private updateCriteriaCache(data: string): void {
    this.criteriaService.getPossibleCriterias(data, 5).subscribe((result) => {
      this.possibleCriterias = [];
      console.log(result);
      result.forEach((e) => this.possibleCriterias.push(e.criteriaName));
    });
  }
}
