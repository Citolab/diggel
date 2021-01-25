import { Component } from '@angular/core';
import { WebPageComponent } from '../web-page.component';
import { ItemThemeType } from '@diggel/data';

@Component({
  selector: 'diggel-toerisme',
  templateUrl: './toerisme.page.html',
  styleUrls: ['./toerisme.page.scss'],
})
export class ToerismeComponent extends WebPageComponent {
  public theme = ItemThemeType.toerisme;
  public itemComponents = this.itemDefinitions
    .filter((i) => i.type === this.theme)
    .map((i) => i.id);
}
