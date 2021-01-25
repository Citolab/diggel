import { Component, ComponentRef } from '@angular/core';
import { BasePageComponent } from '@diggel/ui';
import { slideIn } from '@diggel/ui';
import { itemDefinitions } from '../items/items';
import { ItemThemeType } from '@diggel/data';
import { ItemComponent, ItemDefinition } from '@diggel/ui';

@Component({
  selector: 'diggel-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  animations: [slideIn],
})
export class FeedComponent extends BasePageComponent {
  public theme = ItemThemeType.feed;
  public itemDefinitions = itemDefinitions;
  public profilePictureUrl: string;
  public placement: 'first' | 'lastOrPlaced' | 'firstOrPlaced' =
    'firstOrPlaced';
  public groups: string[];

  afterItemComponentAdded(
    itemComponent: ComponentRef<ItemComponent>,
    item: ItemDefinition
  ) {
    // can be overridden to place item
    const itemElement = itemComponent.location.nativeElement;
    const location = item.location || item.id;
    const container: HTMLElement = document.querySelector(`#${location}`);
    if (container) {
      container.prepend(itemElement);
    }
  }
}
