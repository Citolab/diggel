import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { slideIn } from '@diggel/ui';
import { SpaceTalkBaseComponent } from '../spacetalk-base.component';

@Component({
  selector: 'diggel-blank',
  templateUrl: './blank.page.html',
  styleUrls: ['./blank.page.scss'],
  animations: [slideIn],
})
export class BlankPageComponent extends SpaceTalkBaseComponent {
  public singleItemMode = true;
  public theme = ItemThemeType.blank;
}
