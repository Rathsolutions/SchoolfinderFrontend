//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from "@angular/common/http";
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
import { MatDividerModule } from '@angular/material/divider';
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
import { MatRadioModule } from '@angular/material/radio';
import { MainComponent } from "./overlay/main/main.component";
import { MatTableModule } from "@angular/material/table";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon'
import { ColorPickerModule } from "ngx-color-picker";
import { NgcCookieConsentConfig, NgcCookieConsentModule, NgcLocationOptions } from 'ngx-cookieconsent';

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
import { FooterComponent } from './overlay/footer/footer.component';
import { NgxColorsModule } from "ngx-colors";
import { ConfirmationDialogComponent } from "./dialogs/confirmation-dialog/confirmation-dialog.component";
import { CookieService } from "ngx-cookie-service";

const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: window.location.hostname,
    },
    palette: {
        popup: {
            background: '#000'
        },
        button: {
            background: '#f1d600'
        }
    },
    content: {
        message: "Diese Webseite nutzt technische Cookies, um zu funktionieren",
        link: "Weitere Informationen",
        href: "https://rathsolutions.de/privacy-policy",
        allow: "Erlauben",
        deny: "Verbieten",
        policy: "Cookie Einstellungen",

    },
    law: {
        countryCode: "DE"
    },
    animateRevokable: true,
    position: "top-right",
    theme: 'classic',
    type: 'opt-out'
};

@NgModule({
    declarations: [
        AppComponent,
        BarrierFree,
        MainComponent,
        DialogLogin,
        AddPointOverlay,
        ShowPointOverlay,
        ConfirmationDialogComponent,
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
        FooterComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatCardModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatTableModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatDividerModule,
        MatIconModule,
        ColorPickerModule,
        NgxColorsModule,
        ToastrModule.forRoot(),
        NgcCookieConsentModule.forRoot(cookieConfig)
    ], providers: [CookieService, provideHttpClient(withInterceptorsFromDi(), withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }))]
})
export class AppModule { }
