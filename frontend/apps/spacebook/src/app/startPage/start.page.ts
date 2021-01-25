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
  ngOnInit() {
    this.welcomeMessage = `Ken jij Spacebook al?
    Heel de klas gebruikt het om van alles te delen.
    Ik wil graag dat je me helpt met registreren.`;
    this.firstItem = itemDefinitions[0];
    super.ngOnInit();
  }
}
