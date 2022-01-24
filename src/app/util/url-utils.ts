export class UrlUtils {
  public static convertToValidUrl(url: string): string {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url;
    }
    return "http://" + url;
  }

  public static isUrl(possibleUrl: string): boolean {
    return (
      possibleUrl.startsWith("https://") ||
      possibleUrl.startsWith("http://") ||
      possibleUrl.startsWith("www")
    );
  }
}
