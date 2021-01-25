import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnsureLoggedInGuard } from '@diggel/ui';
import { BlankPageComponent } from './blankPage/blank.page';
import { BrowserComponent } from './browserPage/browser.page';
import { EndPageComponent } from './endPage/end.page';
import { PresentationPageComponent } from './presentationPage/presentation.page';
import { StartPageComponent } from './startPage/start.page';

const appRoutes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    component: StartPageComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'browser/:sequenceNumber',
    component: BrowserComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'blank/:sequenceNumber',
    component: BlankPageComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'powerpoint/:sequenceNumber',
    component: PresentationPageComponent,
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
