import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.page';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BackendUrlInterceptor,
  EnsureLoggedInGuard,
  UiModule,
} from '@diggel/ui';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome/welcome.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomLoader } from '@diggel/data';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'welcome',
    component: WelcomePageComponent,
    canActivate: [EnsureLoggedInGuard],
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    WelcomePageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UiModule,
    RouterModule.forRoot(appRoutes, { useHash: true, relativeLinkResolution: 'legacy' }),
    TranslateModule.forRoot(
      {
        loader: { provide: TranslateLoader, useClass: CustomLoader }
      })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendUrlInterceptor,
      multi: true,
    },
    { provide: 'contextId', useValue: '' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
