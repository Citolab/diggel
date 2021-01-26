import { Component, OnInit } from '@angular/core';
import { BaseStartPageComponent } from '@diggel/ui';
import { itemDefinitions } from '../items/items';

@Component({
  selector: 'diggel-startpage',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPageComponent
  extends BaseStartPageComponent
  implements OnInit {
    public lang = this.translate.currentLang;
  ngOnInit() {
    this.welcomeMessage = this.translate.instant('SPACEBOOK_WELCOME_MESSAGE');
    this.firstItem = itemDefinitions[0];
    super.ngOnInit();
  }
}
