import { Component } from '@angular/core';
import { WebPageComponent } from '../web-page.component';
import { ItemThemeType } from '@diggel/data';

@Component({
  selector: 'diggel-klimaat',
  templateUrl: './klimaat.page.html',
  styleUrls: ['./klimaat.page.scss'],
})
export class KlimaatComponent extends WebPageComponent {
  public theme = ItemThemeType.klimaat;
}
