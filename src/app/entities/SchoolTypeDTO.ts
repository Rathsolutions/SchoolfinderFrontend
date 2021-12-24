export class SchoolTypeDTO {
    id:number;
    r: number;
    g: number;
    b: number;
    schoolTypeValue: string;

    toRGBString() {
        return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    }
}