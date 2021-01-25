import { Type } from '@angular/core';
import { ItemThemeType, ItemUsage } from '@diggel/data';
import { ItemComponent } from './components/item.component';

export class ItemDefinition {
  public id: string;
  public location?: string;
  public sequenceNumber: number;
  public type: ItemThemeType;
  public usage: ItemUsage;
  public component: Promise<Type<ItemComponent>>;
}
