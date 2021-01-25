import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '@diggel/ui';
import { slideIn } from '@diggel/ui';
import {
  itemDefinitions,
} from '../items/items';
import { ItemThemeType, profileImages } from '@diggel/data';

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
  public placement: 'first' | 'lastOrPlaced' | 'firstOrPlaced' = 'first';
  public groups: string[];


  protected afterItemComponentAdded() {
    // override to do nothing
  }
}
