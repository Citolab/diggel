import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { WebPageComponent } from '../web-page.component';

@Component({
  selector: 'diggel-algemeen-sub',
  templateUrl: './algemeen-sub.page.html',
  styleUrls: ['./algemeen-sub.page.scss'],
})
export class AlgemeenSubComponent extends WebPageComponent {
  public theme = ItemThemeType.algemeenSubpagina;
}
