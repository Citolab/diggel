import { Type } from '@angular/core';
import { ItemThemeType, ItemUsage } from '@diggel/data';
import { ItemComponent, ItemDefinition } from '@diggel/ui';

const infoItems = [];
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

export const itemDefinitions: ItemDefinition[] = [

];
