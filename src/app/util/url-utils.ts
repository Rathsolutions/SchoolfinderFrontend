export class UrlUtils {
  public static convertToValidUrl(url: string): string {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url;
    }
    return "http://" + url;
  }

  public static isUrl(possibleUrl: string): boolean {
    console.log(possibleUrl);
    return (
      possibleUrl &&
      (possibleUrl.startsWith("https://") ||
        possibleUrl.startsWith("http://") ||
        possibleUrl.startsWith("www"))
    );
  }

  public static deserializeEmail(email: string): string {
    if (email.startsWith("mailto:")) {
      return email.substring(7);
    }
    return email;
  }

  public static formatEmailToLink(email: string): string {
    return "mailto:" + email;
  }

  public static isStringEmail(possibleEmail: string): boolean {
    return possibleEmail.indexOf("@") != -1;
  }

  public static splitEmailsIntoSingleList(emails: string): string[] {
    return emails
      .split(" ")
      .map((e) => (this.isStringEmail(e) ? this.formatEmailToLink(e) : e));
  }
}
