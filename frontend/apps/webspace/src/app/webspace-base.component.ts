import { Component } from '@angular/core';
import { slideIn } from '@diggel/ui';
import { BasePageComponent } from '@diggel/ui';
import { itemDefinitions } from './items/items';

@Component({
  selector: 'diggel-intro',
  template: 'NO HTML HERE',
  animations: [slideIn],
})
export class WebspaceBaseComponent extends BasePageComponent {
  public itemDefinitions = itemDefinitions;
}
