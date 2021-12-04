export class SchoolTypeDTO {
    r: number;
    g: number;
    b: number;
    schoolTypeValue: string;

    toRGBString() {
        return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    }
}