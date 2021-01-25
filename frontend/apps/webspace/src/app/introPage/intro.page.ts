import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { slideIn } from '@diggel/ui';
import { WebspaceBaseComponent } from '../webspace-base.component';

@Component({
  selector: 'diggel-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  animations: [slideIn],
})
export class IntroComponent extends WebspaceBaseComponent {
  public singleItemMode = true;
  public theme = ItemThemeType.intro;
}
