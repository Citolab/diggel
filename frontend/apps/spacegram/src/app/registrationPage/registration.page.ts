import { Component, OnInit } from '@angular/core';
import { slideIn, BasePageComponent } from '@diggel/ui';
import { itemDefinitions } from '../items/items';
import { ItemThemeType } from '@diggel/data';

@Component({
  selector: 'diggel-feed',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  animations: [slideIn],
})
export class RegistrationComponent extends BasePageComponent implements OnInit {
  public singleItemMode = true;
  public registrationSteps: Array<{ id: string, text: string }> = [];
  public itemDefinitions = itemDefinitions;
  public theme = ItemThemeType.registration;
  ngOnInit(): void {
    this.translate.setTranslation('en', {
      DIGGEL_NOT_ANSWERED: '<span class="h5">😱</span> The registration is not yet completed.'
    }, true);
    this.translate.setTranslation('nl', {
      DIGGEL_NOT_ANSWERED: '<span class="h5">😱</span> Je bent nog niet klaar met registreren.'
    }, true);
    const stepText = this.translate.currentLang === 'nl' ?
    ['Account', 'Suggesties', 'Volgen'] :
    ['Account', 'Suggestions', 'Follow'];
  this.registrationSteps =
    ['account', 'suggestions', 'follow'].map((id, index) => {
      return { id, text: stepText[index] };
    });
  }

}
