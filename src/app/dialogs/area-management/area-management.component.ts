import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CalculationEventService } from 'src/app/broadcast-event-service/CalculationEventService';
import { AreaEntity } from 'src/app/entities/AreaEntity';
import { PersistStrategy } from 'src/app/services/persistStrategy/PersistStrategy';
import { AbstractManagement } from '../category-management/abstract-management';
import { AreaSelectionService } from "../../broadcast-event-service/AreaSelectionService";

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrls: ['./area-management.component.css']
})
export class AreaManagementComponent extends AbstractManagement<AreaManagementComponent, AreaManagementData> implements OnInit {

  constructor(
    dialogRef: MatDialogRef<AreaManagementComponent>,
    @Inject(MAT_DIALOG_DATA) data: AreaManagementData,
    calculationEventService: CalculationEventService,
    toastrService: ToastrService,
    private areaSelectionService: AreaSelectionService
  ) {
    super(dialogRef, data, calculationEventService, toastrService);
  }

  ngOnInit(): void {
  }
  setAreaInstitutionPosition() {

  }
  setArea() {
    this.areaSelectionService.emit(this.data);
    this.dialogRef.close();
  }
  saveChanges(): void {
    // var projectCategoryEntity = new ProjectCategoryEntity();
    // projectCategoryEntity.id = this.data.id;
    // projectCategoryEntity.name = this.data.name;
    // projectCategoryEntity.icon = this.data.icon;
    // super.saveChanges(projectCategoryEntity);
  }
}
export interface AreaManagementData {
  name: string;
  id: number;
  adminNotice: string;
  persistStrategy: PersistStrategy<AreaEntity>;
}