import { Component, AfterViewInit, HostListener } from '@angular/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})

export class AppComponent implements AfterViewInit {
  constructor(private ccService: NgcCookieConsentService) {
    this.ccService.statusChange$.subscribe(sub => {
      this.ccService.close(false)
    })

  }
  ngAfterViewInit(): void {
    if (this.ccService.hasAnswered) {
      this.ccService.toggleRevokeButton(false)
    }
  }

}
