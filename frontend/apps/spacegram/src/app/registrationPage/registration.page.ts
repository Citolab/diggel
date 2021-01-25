import { Component } from '@angular/core';
import { slideIn, BasePageComponent } from '@diggel/ui';
import { itemDefinitions } from '../items/items';
import { ItemThemeType } from '@diggel/data';

@Component({
  selector: 'diggel-feed',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  animations: [slideIn],
})
export class RegistrationComponent extends BasePageComponent {
  public singleItemMode = true;
  public notificationMessage =
    '<span class="h5">😱</span> Je bent nog niet klaar met registreren.';
  public registrationSteps: Array<string> = ['Account', 'Suggesties', 'Volgen'];
  public itemDefinitions = itemDefinitions;
  public theme = ItemThemeType.registration;
}
