import { Component } from '@angular/core';
import { CordovaService } from '@diggel/ui';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'diggel-root',
  template: ` <div class="d-flex">
  <div class="position-absolute d-flex flex-column"
  style="top: 5px; left: 5px">
  <span
    style="z-index: 1000; cursor: pointer"
    (click)="setLang('en')"
    *ngIf="translate.currentLang !== 'en'"
    class="badge badge-info m-2"
  >
    EN
  </span>

  <span
    style="z-index: 1000; cursor: pointer"
    (click)="setLang('nl')"
    *ngIf="translate.currentLang !== 'nl'"
    class="badge badge-info m-2"
  >
    NL
  </span>
</div>
  <router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  constructor(public cordovaService: CordovaService, public translate: TranslateService) {
    if (environment.useBackend && environment.production) {
      cordovaService.checkUpdate();
      cordovaService.screenLandscape();
    }
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(localStorage.getItem('lang') || 'en');
  }
  setLang(lang: string) {
    localStorage.setItem('lang', lang || 'en')
    this.translate.use(lang || 'en');
    window.location.reload();
  }
}
