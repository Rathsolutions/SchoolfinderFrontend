export class SelectionDialogViewData {
    private title: string = "";
    private subtitle: string = "";
    private latitude: number;
    private longitude: number;

    constructor(title: string, subtitle: string, latitude: number, longitude: number) {
        this.title = title;
        this.subtitle = subtitle;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public getTitle() {
        return this.title;
    }

    public getSubtitle() {
        return this.subtitle;
    }


    public getLatitude() {
        return this.latitude;
    }

    public getLongitude() {
        return this.longitude;
    }
}