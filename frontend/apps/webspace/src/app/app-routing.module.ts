import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartPageComponent } from './startPage/start.page';
import { EndPageComponent } from './endPage/end.page';
import { HomeComponent } from './homePage/home.page';
import { BrowserComponent } from './browserPage/browser.page';
import { IntroComponent } from './introPage/intro.page';
import { KlimaatComponent } from './klimaatPage/klimaat.page';
import { AlgemeenComponent } from './algemeenPage/algemeen.page';
import { ToerismeComponent } from './toerismePage/toerisme.page';
import { DierenComponent } from './dierenPage/dieren.page';
import { HandigeWebsitesComponent } from './handige-websitesPage/handige-websites.page';
import { AlgemeenSubComponent } from './algemeenSubPage/algemeen-sub.page';
import { FinalComponent } from './finalPage/final.page';
import { EnsureLoggedInGuard } from '@diggel/ui';

const appRoutes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    component: StartPageComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'intro/:sequenceNumber',
    component: IntroComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'home/:sequenceNumber',
    component: HomeComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'browser/:sequenceNumber',
    component: BrowserComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'klimaat/:sequenceNumber',
    component: KlimaatComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'algemeen/:sequenceNumber',
    component: AlgemeenComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'algemeenSubpagina/:sequenceNumber',
    component: AlgemeenSubComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'dieren/:sequenceNumber',
    component: DierenComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'handigeWebsites/:sequenceNumber',
    component: HandigeWebsitesComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'toerisme/:sequenceNumber',
    component: ToerismeComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'final/:sequenceNumber',
    component: FinalComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'end',
    component: EndPageComponent,
    canActivate: [EnsureLoggedInGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
