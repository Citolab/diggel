import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ItemModule } from './items/item.module';
import { StartPageComponent } from './startPage/start.page';
import { FormsModule } from '@angular/forms';
import { BackendUrlInterceptor, UiModule } from '@diggel/ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserComponent } from './browserPage/browser.page';
import { BlankPageComponent } from './blankPage/blank.page';
import { PresentationPageComponent } from './presentationPage/presentation.page';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from '@ngx-translate/core';
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
    TranslateModule.forRoot()
  ],
  declarations: [
    AppComponent,
    StartPageComponent,
    BrowserComponent,
    BlankPageComponent,
    PresentationPageComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendUrlInterceptor,
      multi: true,
    },
    { provide: 'contextId', useValue: 'D' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

@NgModule({})
export class AppWebspaceSharedModule {
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: [],
    };
  }
}
