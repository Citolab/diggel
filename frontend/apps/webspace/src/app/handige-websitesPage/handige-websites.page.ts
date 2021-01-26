import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { WebPageComponent } from '../web-page.component';

@Component({
  selector: 'diggel-handige-websites',
  templateUrl: './handige-websites.page.html',
  styleUrls: ['./handige-websites.page.scss'],
})
export class HandigeWebsitesComponent extends WebPageComponent {
  public theme = ItemThemeType.handigeWebsites;
}
