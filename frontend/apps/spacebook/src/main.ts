import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from 'environments/environment';

if (environment.production) {
  enableProdMode();
}

const onDeviceReady = () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((window as any).cordova) {
  window.addEventListener('load', onDeviceReady);
} else {
  onDeviceReady();
}
