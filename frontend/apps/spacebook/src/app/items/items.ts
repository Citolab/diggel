import { Type } from '@angular/core';
import { ItemThemeType, ItemUsage } from '@diggel/data';
import { ItemComponent, ItemDefinition } from '@diggel/ui';

export const itemWelcomeSpacebook = 'welcome';
export const itemTangare = 'tangare';
export const itemWorkflow = 'workflow';
export const itemFunnyVideo = 'funny-video';

const infoItems = [itemWelcomeSpacebook];
const itemLocation: Map<string, string> = new Map([

]);

const addType = (
  items: { id: string; component: Promise<unknown> }[],
  type: ItemThemeType
): ItemDefinition[] => {
  return items.map((item, index) => {
    return {
      id: item.id,
      location: itemLocation.get(item.id),
      sequenceNumber: 1 + index,
      type,
      component: item.component as Promise<Type<ItemComponent>>,
      usage: infoItems.find((i) => i === item.id)
        ? ItemUsage.info
        : ItemUsage.regular,
    };
  });
};

const feedItems = addType([
  { id: itemWelcomeSpacebook, component: import('./welcome-spacebook/welcome-spacebook.component'), },
  { id: itemTangare, component: import('./tangare/tangare.component') },
  { id: itemWorkflow, component: import('./workflow/workflow.component') },
  { id: itemFunnyVideo, component: import('./funny-video/funny-video.component') }
], ItemThemeType.feed);



export const itemDefinitions: ItemDefinition[] = [
  ...feedItems
];
