import { Component, Input, OnInit } from '@angular/core';
import { CriteriaSelectionEventService } from 'src/app/broadcast-event-service/CriteriaSelectionChangedEventService';
import { MapUpdateEventService } from 'src/app/broadcast-event-service/MapUpdateEventService';
import { VisibilityEventService } from 'src/app/broadcast-event-service/VisibilityEventService';
import { InstitutionLegendHideEventStrategy } from 'src/app/broadcast-event-service/visibility-event-strategies/InstitutionLegendHideEventStrategy';
import { InstitutionLegendShowEventStrategy } from 'src/app/broadcast-event-service/visibility-event-strategies/InstitutionLegendShowEventStrategy';
import { VisibilityEventType } from 'src/app/broadcast-event-service/visibility-event-strategies/VisibilityEventStrategy';
import { SchoolTypeDTO } from 'src/app/entities/SchoolTypeDTO';
import { SchoolTypeService } from 'src/app/services/school-type.service';
import { Styles } from 'src/app/util/styles';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent implements OnInit {

  StyleInternal = Styles;

  visible: boolean = true;

  @Input()
  private projectParamId: number;

  allSchoolTypesForColorLegend: SchoolTypeDTO[] = [];


  constructor(private schoolTypeService: SchoolTypeService, private mapUpdateEventService: MapUpdateEventService, private criteriaSelectionEventService: CriteriaSelectionEventService, private visibilityEventService: VisibilityEventService
  ) { }
  ngOnInit(): void {
    this.updateColorLegend(this.allSchoolTypesForColorLegend);
    this.criteriaSelectionEventService.register().subscribe(() => {
      this.updateColorLegend(this.allSchoolTypesForColorLegend);
    })
    this.mapUpdateEventService.register().subscribe(() => {
      this.updateColorLegend(this.allSchoolTypesForColorLegend);
    });
    this.visibilityEventService.register().subscribe(res => {
      if (res.getEventType() != VisibilityEventType.INSTITUTION_LEGEND) {
        return;
      }
      this.visible = res instanceof InstitutionLegendShowEventStrategy;
    });
  }

  private updateColorLegend(arrayToUpdate: SchoolTypeDTO[]) {
    if (this.projectParamId) {
      this.schoolTypeService
        .findSchoolTypesInProject(this.projectParamId)
        .subscribe((res) => {
          arrayToUpdate.splice(0, arrayToUpdate.length);
          res.forEach(e => {
            arrayToUpdate.push(e);
          });
        });
    } else {
      this.schoolTypeService
        .findSchoolTypesUsedAtLeastOnce()
        .subscribe((res) => {
          arrayToUpdate.splice(0, arrayToUpdate.length);
          res.forEach(e => {
            arrayToUpdate.push(e);
          });
        });
    }
  }
}
