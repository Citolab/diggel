import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { WebspaceBaseComponent } from '../webspace-base.component';

@Component({
  selector: 'diggel-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomeComponent extends WebspaceBaseComponent {
  public theme = ItemThemeType.home;
}
