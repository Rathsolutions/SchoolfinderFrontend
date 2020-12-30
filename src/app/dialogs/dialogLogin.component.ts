//Copyright 2020 Nico Rath Rathsolutions, licensed under GPLv3. For more information about the license have a look into the file LICENSE
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'dialogLogin',
    templateUrl: './dialogLogin.component.html',
})
export class DialogLogin {

    constructor(
        public dialogRef: MatDialogRef<DialogLogin>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
export interface DialogData {
    username: string;
    password: string;
}
