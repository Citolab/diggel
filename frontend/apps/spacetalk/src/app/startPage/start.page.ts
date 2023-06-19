import { Component, OnInit } from '@angular/core';
import { BaseStartPageComponent } from '@diggel/ui';
import { itemDefinitions } from './../items/items';

@Component({
  selector: 'diggel-startpage',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPageComponent
  extends BaseStartPageComponent
  implements OnInit {
  ngOnInit() {
    this.welcomeMessage = `Ik moet een spreekbeurt maken over de Tweede Wereldoorlog met het programma
      SpaceTalk. Ik heb dit nog niet zo vaak gedaan. Kun jij me helpen? `;
    this.firstItem = itemDefinitions[0];
    super.ngOnInit();
  }
}
