import { Color } from "@angular-material-components/color-picker";

export class ColorParser {
  public static parseRgbaString(input: string): Color {
    var splitted = input.split("(")[1].split(",");
    var color: Color = new Color(
      parseInt(splitted[0]),
      parseInt(splitted[1]),
      parseInt(splitted[2]),
      splitted.length == 4 ? parseFloat(splitted[3]) : 1
    );
    return color;
  }
}
