//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Type, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Inject, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'search-selection-component',
    templateUrl: './searchSelection.component.html',
    styleUrls: ['./searchSelection.component.scss']
})
export class SearchSelectionComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<SearchSelectionComponent>,
        @Inject(MAT_DIALOG_DATA) public entries: any) { }

    ngOnInit(): void {
        console.log(this.entries);
    }

    public onCardClick(indice) {
        console.log(this.entries.result[indice]);
        this.dialogRef.close(this.entries.result[indice])
    }

}