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
    this.notificationMessage = this.translate.instant('DIGGEL_REGISTRATION_NOT_ANSWERED');
    const stepText = this.translate.currentLang === 'nl' ?
      ['Account', 'Voorkeuren', 'Profielfoto', 'Groepen', `Pagina's`] :
      ['Account', 'Preferences', 'Profile picture', 'Groups', 'Pages'];
    this.registrationSteps =
      ['account', 'preferences', 'photo', 'groups', 'pages'].map((id, index) => {
        return { id, text: stepText[index] };
      });
  }
}
