import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { slideIn } from '@diggel/ui';
import { WebspaceBaseComponent } from '../webspace-base.component';

@Component({
  selector: 'diggel-final',
  templateUrl: './final.page.html',
  styleUrls: ['./final.page.scss'],
  animations: [slideIn],
})
export class FinalComponent extends WebspaceBaseComponent {
  public singleItemMode = true;
  public theme = ItemThemeType.final;
}
