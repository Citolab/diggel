import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { WebPageComponent } from '../web-page.component';

@Component({
  selector: 'diggel-dieren',
  templateUrl: './dieren.page.html',
  styleUrls: ['./dieren.page.scss'],
})
export class DierenComponent extends WebPageComponent {
  public theme = ItemThemeType.dieren;
}
