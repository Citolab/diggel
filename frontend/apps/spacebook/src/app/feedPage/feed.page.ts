import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '@diggel/ui';
import { slideIn } from '@diggel/ui';
import {
  itemDefinitions,
  itemProfielFoto,
  itemGroepsverzoek,
} from '../items/items';
import { ItemThemeType, profileImages } from '@diggel/data';
import { groepen } from '../items/groepsverzoek/groepen';

@Component({
  selector: 'diggel-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  animations: [slideIn],
})
export class FeedComponent extends BasePageComponent implements OnInit {
  public theme = ItemThemeType.feed;
  public itemDefinitions = itemDefinitions;
  public profilePictureUrl: string;
  public placement: 'first' | 'lastOrPlaced' | 'firstOrPlaced' = 'first';
  public groups: string[];

  ngOnInit(): void {
    const groups = groepen?.map((g, index) => ({
      ...g,
      selected: false,
      id: index,
    }));
    const profileItem = this.userService.testSession?.itemResults?.find(
      (item) => item.id === itemProfielFoto
    );
    if (
      profileItem &&
      profileItem.responses &&
      profileItem.responses.length > 0
    ) {
      this.profilePictureUrl =
        profileImages[+profileItem.responses[0].value].url;
    }
    const groupItem = this.userService.testSession?.itemResults?.find(
      (item) => item.id === itemGroepsverzoek
    );
    if (
      groupItem &&
      groupItem.responses &&
      groupItem.responses.length > 0 &&
      groupItem.responses[0].value
    ) {
      const groupIds = groupItem.responses[0].value.split(',').map((g) => +g);
      this.groups = groupIds.map((gId) => {
        const group = groups.find((g) => g.id === gId);
        return group ? group.Groep : '';
      });
    }
  }

  protected afterItemComponentAdded() {
    // override to do nothing
  }
}
