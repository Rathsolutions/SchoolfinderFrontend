import { Rgba } from "ngx-color-picker";

export class ColorParser {
  public static parseRgbaString(input: string): Rgba {
    if (!input.startsWith("rgba")) {
      return new Rgba(0, 0, 0, 0);
    }
    var splitted = input.split("(")[1].split(",");
    var color: Rgba = new Rgba(
      parseInt(splitted[0]),
      parseInt(splitted[1]),
      parseInt(splitted[2]),
      splitted.length == 4 ? parseFloat(splitted[3]) : 1
    );
    return color;
  }

  public static rgbaToString(color: Rgba) {
    return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
  }
}
