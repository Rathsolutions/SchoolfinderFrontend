import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})

export class AppComponent implements AfterViewInit {
  constructor(private ccService: NgcCookieConsentService, cookieService:CookieService) {
    this.ccService.statusChange$.subscribe(sub => {
      var internalCookieService = cookieService;
      if(sub.status === "deny"){
        cookieService.delete("XSRF-TOKEN")
      }
      this.ccService.close(false)
    })

  }
  ngAfterViewInit(): void {
    if (this.ccService.hasAnswered) {
      this.ccService.toggleRevokeButton(false)
    }
  }

}
