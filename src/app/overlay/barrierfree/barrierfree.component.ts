import { ChangeDetectorRef, Component, effect, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { SchoolsService } from "src/app/services/schools.service";
import { SchoolPersonEntity } from "src/app/entities/SchoolPersonEntity";
import { TransitionCheckState } from "@angular/material/checkbox";
import { PersonEntity } from "src/app/entities/PersonEntity";
import { PersonFunctionality } from "src/app/entities/PersonFunctionalityEntity";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "src/app/util/globals";
import { ProjectCategoryService } from "src/app/services/project-category.service";
import { Observable } from "rxjs";
import { MatCard } from "@angular/material/card";

@Component({
  selector: "barrierfree-component",
  templateUrl: "./barrierfree.component.html",
  styleUrls: ["./barrierfree.component.css"],
  standalone: false
})
export class BarrierFree implements OnInit {

  displayedColumns: string[] = ["name", "arContent", "makerspaceContent"];
  data: SchoolPersonEntity[];
  projectParam: number;
  focusedCardId = 0;

  @ViewChildren(MatCard, { read: ElementRef }) private allCards: QueryList<MatCard>;

  constructor(protected schoolsService: SchoolsService,
    private projectCategoryService: ProjectCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      var projectParam = params.get("projectId");
      if (projectParam) {
        this.projectParam = parseInt(projectParam);
        Globals.activeProject = this.projectParam;
      }
    });
    var allSchoolsObservable: Observable<SchoolPersonEntity[]>;
    if (this.projectParam) {
      allSchoolsObservable = this.projectCategoryService.findAllSchoolsForProjectWithId(this.projectParam);
    } else {
      allSchoolsObservable = this.schoolsService.getAllSchools();
    }

    allSchoolsObservable.subscribe((result) => {
      this.data = result;
    });

  }

  public getAdditionalInformationList(school: SchoolPersonEntity): Map<string, string[]> {
    var toReturn: Map<string, string[]> = new Map();
    school.additionalInformation.forEach(e => {
      if (!toReturn.has(e.type)) {
        toReturn.set(e.type, []);
      }
      toReturn.get(e.type).push(e.value);
    });
    return toReturn;
  }
  public getProjectList(school: SchoolPersonEntity): string {
    var projectNames = "Gruppe";
    if (school.projects.length > 1) {
      projectNames += "n";
    }
    projectNames += ": ";
    school.projects.forEach((e) => {
      projectNames += e.name + ", ";
    });
    projectNames = projectNames.substring(0, projectNames.length - 2);
    return projectNames;
  }


  switchToMainView() {
    var url = "/";
    if (Globals.activeProject) {
      url += 'project/' + Globals.activeProject;
    }
    this.router.navigate([url])
  }
  focus($event: any, activeId: number) {
    this.focusedCardId = activeId;
  }
  keyPressedOnCard($event: KeyboardEvent) {
    if ($event.key != "ArrowRight" && $event.key != "ArrowLeft") {
      return;
    }
    if ($event.key == "ArrowRight") {
      if (this.allCards.length - 1 == this.focusedCardId) {
        this.focusedCardId = 0;
      } else {
        this.focusedCardId++;
      }
    } else if ($event.key == "ArrowLeft") {
      if (this.focusedCardId == 0) {
        this.focusedCardId = this.allCards.length - 1
      } else {
        this.focusedCardId--;

      }
    }
    $event.preventDefault();
    (this.allCards.get(this.focusedCardId) as any).nativeElement.focus();
  }
  formatCardName(institutionName: string): string {
    return "Karte der Institution " + institutionName;
  }
}
