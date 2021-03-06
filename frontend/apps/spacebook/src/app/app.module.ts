import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ItemModule } from './items/item.module';
import { FeedComponent } from './feedPage/feed.page';
import { RegistrationComponent } from './registrationPage/registration.page';
import { StartPageComponent } from './startPage/start.page';
import { EndPageComponent } from './endPage/end.page';
import { FormsModule } from '@angular/forms';
import { UiModule } from '@diggel/ui';
import { BackendUrlInterceptor } from '@diggel/ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomLoader } from '@diggel/data';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ItemModule,
    NgbModule,
    FormsModule,
    UiModule,
    TranslateModule.forRoot(
      {
        loader: { provide: TranslateLoader, useClass: CustomLoader }
      })
  ],
  declarations: [
    AppComponent,
    FeedComponent,
    StartPageComponent,
    EndPageComponent,
    RegistrationComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendUrlInterceptor,
      multi: true,
    },
    { provide: 'contextId', useValue: 'A' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

@NgModule({})
export class AppSpacebookSharedModule {
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: [],
    };
  }
}
