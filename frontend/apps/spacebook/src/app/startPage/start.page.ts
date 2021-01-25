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
    this.welcomeMessage = `<p>Have you heard about Spacebook?</p>
    <p>Everyone in my class uses Spacebook to share pictures, music, videos, and articles!</p>
    <p>Would you like to help me using it?</p>`;
    this.firstItem = itemDefinitions[0];
    super.ngOnInit();
  }
}
