import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './feedPage/feed.page';
import { StartPageComponent } from './startPage/start.page';

import { RegistrationComponent } from './registrationPage/registration.page';
import { EndPageComponent } from './endPage/end.page';
import { EnsureLoggedInGuard } from '@diggel/ui';

const appRoutes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    component: StartPageComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'feed/:sequenceNumber',
    component: FeedComponent,
    canActivate: [EnsureLoggedInGuard],
  },
  {
    path: 'registration/:sequenceNumber',
    component: RegistrationComponent,
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
