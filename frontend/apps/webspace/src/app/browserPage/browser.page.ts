import { Component } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { slideIn } from '@diggel/ui';
import { WebspaceBaseComponent } from '../webspace-base.component';

@Component({
  selector: 'diggel-blank',
  templateUrl: './browser.page.html',
  styleUrls: ['./browser.page.scss'],
  animations: [slideIn],
})
export class BrowserComponent extends WebspaceBaseComponent {
  public singleItemMode = true;
  public notificationMessage =
    '<span class="h5">😱</span> Je bent nog niet klaar met registreren.';
  public theme = ItemThemeType.browser;
}
