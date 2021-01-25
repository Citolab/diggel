import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { slideIn } from '@diggel/ui';
import { SpaceTalkBaseComponent } from '../spacetalk-base.component';

@Component({
  selector: 'diggel-browser',
  templateUrl: './browser.page.html',
  styleUrls: ['./browser.page.scss'],
  animations: [slideIn],
})
export class BrowserComponent extends SpaceTalkBaseComponent {
  public singleItemMode = true;
  public notificationMessage =
    '<span class="h5">😱</span> Je bent nog niet klaar met registreren.';
  public theme = ItemThemeType.browser;
}
