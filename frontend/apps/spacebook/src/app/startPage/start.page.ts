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
    this.translate.setTranslation('en', {
      SPACEBOOK_WELKOM_MESSAGE: `<p>Have you heard about Spacebook?</p>
      <p>Everyone in my class uses Spacebook to share pictures, music, videos, and articles!</p>
      <p>Would you like to help me using it?</p>`
    });
    this.translate.setTranslation('nl', {
      SPACEBOOK_WELKOM_MESSAGE: `<p>Ken jij Spacebook al?</p>
      <p>Heel de klas gebruikt het om van alles te delen.</p>
      <p>Ik wil graag dat je me helpt met registreren.</p>`
    });
    this.welcomeMessage = this.translate.instant('SPACEBOOK_WELKOM_MESSAGE');
    this.firstItem = itemDefinitions[0];
    super.ngOnInit();
  }
}
