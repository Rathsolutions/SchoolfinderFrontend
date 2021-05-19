//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OsmPOIEntity } from '../entities/OsmPOIEntity';
import { SelectionDialogViewData } from '../viewdata/SelectionDialogViewData';

@Component({
    selector: 'search-selection-component',
    templateUrl: './searchSelection.component.html',
    styleUrls: ['./searchSelection.component.scss']
})
export class SearchSelectionComponent implements OnInit {

    dialogTitle: string = "";
    dialogUnderline:string = "";
    entries:SelectionDialogViewData[];

    constructor(
        public dialogRef: MatDialogRef<SearchSelectionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.entries = data.cardData;
            this.dialogTitle = data.headline;
            this.dialogUnderline = data.underheadline;
         }

    ngOnInit(): void {
        console.log(this.entries);
    }

    public onCardClick(indice) {
        this.dialogRef.close(this.entries[indice])
    }

}