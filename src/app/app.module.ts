//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { DialogLogin } from "./dialogs/dialogLogin.component";
import { SearchSelectionComponent } from "./dialogs/searchSelection.component";
import { AddPointOverlay } from "./overlay/points/addpoint/addpointoverlay.component";
import { ShowPointOverlay } from "./overlay/points/showpoint/showpoint.component";
import { AddCriteriaComponent } from "./overlay/points/addpoint/criteria/addcriteria.component";
import { CriteriaFilterComponent } from "./overlay/filter/criteria/criteria.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from "@angular-material-components/color-picker";
import { MainComponent } from "./overlay/main/main.component";
import { MatTableModule } from "@angular/material/table";
import { MatListModule } from "@angular/material/list";
import { BarrierFree } from "./overlay/barrierfree/barrierfree.component";
import { MapCompComponent } from "./overlay/map-comp/map-comp.component";
import { ShowPersonComponent } from "./viewdata/viewonly-person/showperson.component";
import { AddPersonComponent } from "./viewdata/editable-person/addperson.component";
import { SchoolCategoryManagementComponent } from "./dialogs/category-management/school-category-management/school-category-management.component";
import { CreateCategoryComponent } from "./dialogs/category-management/create-category/create-category.component";
import { PersonCategoryManagementComponent } from "./dialogs/category-management/person-category-management/person-category-management.component";
import { AreaManagementComponent } from "./dialogs/area-management/area-management.component";
import { AddAdditionalInformation } from "./viewdata/additional-information/add/add-additional-information.component";
import { AdditionalCategoryManagementComponentComponent } from './dialogs/category-management/additional-category-management-component/additional-category-management-component.component';
import { ShowAdditionalInformation } from "./viewdata/additional-information/show/show-additional-information.component";
import { DsgvoComponent } from './dsgvo/dsgvo.component';

@NgModule({
  declarations: [
    AppComponent,
    BarrierFree,
    MainComponent,
    DialogLogin,
    AddPointOverlay,
    ShowPointOverlay,
    AddCriteriaComponent,
    CriteriaFilterComponent,
    SearchSelectionComponent,
    MapCompComponent,
    ShowPersonComponent,
    AddPersonComponent,
    SchoolCategoryManagementComponent,
    CreateCategoryComponent,
    PersonCategoryManagementComponent,
    AreaManagementComponent,
    AddAdditionalInformation,
    ShowAdditionalInformation,
    AdditionalCategoryManagementComponentComponent,
    DsgvoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatListModule,
    MatProgressSpinnerModule,
    NgxMatColorPickerModule,
    ToastrModule.forRoot(),
  ],
  providers: [{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  bootstrap: [AppComponent],
})
export class AppModule { }
