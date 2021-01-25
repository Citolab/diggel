import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { WebPageComponent } from '../web-page.component';

@Component({
  selector: 'diggel-algemeen',
  templateUrl: './algemeen.page.html',
  styleUrls: ['./algemeen.page.scss'],
})
export class AlgemeenComponent extends WebPageComponent {
  public theme = ItemThemeType.algemeen;
}
