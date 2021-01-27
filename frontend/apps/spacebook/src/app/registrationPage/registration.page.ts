import { Component, OnInit } from '@angular/core';
import { slideIn } from '@diggel/ui';
import { itemDefinitions } from '../items/items';
import { ItemThemeType } from '@diggel/data';
import { BasePageComponent } from '@diggel/ui';

@Component({
  selector: 'diggel-feed',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  animations: [slideIn],
})
export class RegistrationComponent extends BasePageComponent implements OnInit {
  public itemDefinitions = itemDefinitions;
  public theme = ItemThemeType.registration;
  public singleItemMode = true;
  public registrationSteps: Array<{ id: string, text: string }> = [];

  ngOnInit(): void {
    this.translate.setTranslation('en', {
      DIGGEL_NOT_ANSWERED: '<span class="h5">😱</span> The registration is not yet completed.'
    }, true);
    this.translate.setTranslation('nl', {
      DIGGEL_NOT_ANSWERED: '<span class="h5">😱</span> Je bent nog niet klaar met registreren.'
    }, true);
    const stepText = this.translate.currentLang === 'nl' ?
      ['Account', 'Voorkeuren', 'Profielfoto', 'Groepen', `Pagina's`] :
      ['Account', 'Preferences', 'Profile picture', 'Groups', 'Pages'];
    this.registrationSteps =
      ['account', 'preferences', 'photo', 'groups', 'pages'].map((id, index) => {
        return { id, text: stepText[index] };
      });
  }
}
