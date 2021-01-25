import { Component } from '@angular/core';
import { CordovaService } from '@diggel/ui';
import { environment } from 'environments/environment';

@Component({
  selector: 'diggel-root',
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  constructor(public cordovaService: CordovaService) {
    if (environment.useBackend && environment.production) {
      cordovaService.checkUpdate();
      cordovaService.screenLandscape();
    }
  }
}
