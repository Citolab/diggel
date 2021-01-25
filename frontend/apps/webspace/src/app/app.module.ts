import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ItemModule } from './items/item.module';
import { StartPageComponent } from './startPage/start.page';
import { EndPageComponent } from './endPage/end.page';
import { FormsModule } from '@angular/forms';
import { BackendUrlInterceptor, UiModule } from '@diggel/ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './homePage/home.page';
import { IntroComponent } from './introPage/intro.page';
import { KlimaatComponent } from './klimaatPage/klimaat.page';
import { AlgemeenComponent } from './algemeenPage/algemeen.page';
import { ToerismeComponent } from './toerismePage/toerisme.page';
import { HandigeWebsitesComponent } from './handige-websitesPage/handige-websites.page';
import { DierenComponent } from './dierenPage/dieren.page';
import { AlgemeenSubComponent } from './algemeenSubPage/algemeen-sub.page';
import { FinalComponent } from './finalPage/final.page';
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
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    KlimaatComponent,
    AlgemeenComponent,
    AlgemeenSubComponent,
    ToerismeComponent,
    StartPageComponent,
    EndPageComponent,
    DierenComponent,
    HandigeWebsitesComponent,
    IntroComponent,
    FinalComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendUrlInterceptor,
      multi: true,
    },
    { provide: 'contextId', useValue: 'C' },
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
