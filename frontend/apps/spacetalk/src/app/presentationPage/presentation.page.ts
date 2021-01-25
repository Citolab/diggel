import { Component, ComponentRef } from '@angular/core';
import { ItemThemeType } from '@diggel/data';
import { slideIn, ItemComponent, ItemDefinition } from '@diggel/ui';
import { SpaceTalkBaseComponent } from '../spacetalk-base.component';

@Component({
  selector: 'diggel-presentation',
  templateUrl: './presentation.page.html',
  styleUrls: ['./presentation.page.scss'],
  animations: [slideIn],
})
export class PresentationPageComponent extends SpaceTalkBaseComponent {
  public singleItemMode = true;
  public theme = ItemThemeType.powerpoint;
  public thumbnailSlides = [];
  public itemComponents = [];
  public loadingItemsCount = 0;
  private components: ComponentRef<ItemComponent>[] = [];

  async createComponent(item: ItemDefinition): Promise<ItemComponent> {
    this.loadingItemsCount++;
    return super.createComponent(item);
  }

  protected afterItemComponentAdded(
    itemComponent: ComponentRef<ItemComponent>
  ) {
    const id = itemComponent.instance.location || itemComponent.instance.id;
    const componentsToRemove: ComponentRef<ItemComponent>[] = [];
    const existingItem = this.components.find((c) => c.instance.id === id);
    if (existingItem) {
      this.components.splice(this.components.indexOf(existingItem, 1));
      existingItem.destroy();
      componentsToRemove.push(existingItem);
    } else {
      this.itemComponents.push(id);
    }
    this.components.push(itemComponent);
    const itemInstancesToMove = this.components.filter(
      (i) =>
        i.instance.readonly && !this.thumbnailSlides.includes(i.instance.id)
    );
    setTimeout(() => {
      componentsToRemove.forEach((i) => {
        const el = i.location.nativeElement as HTMLElement;
        el.remove();
      });
      itemInstancesToMove.forEach((i) => {
        const instanceId = i.instance.location || i.instance.id;
        const newLocation = document.querySelector(`#item-${instanceId}`);
        if (newLocation) {
          this.thumbnailSlides.push(instanceId);
          newLocation.append(i.location.nativeElement);
        }
      });
      this.loadingItemsCount--;
      if (this.loadingItemsCount === 0 && itemInstancesToMove.length !== 0) {
        setTimeout(() => {
          const lastItemComponent =
            itemInstancesToMove[itemInstancesToMove.length - 1].instance;
          const lastItem = document.querySelector(
            `#item-${lastItemComponent.id}`
          );
          lastItem?.scrollIntoView({ behavior: 'smooth' });
        }, 200);

        // setTimeout(() => {
        //   const scollableDiv = document.querySelector(`#slides`) as HTMLElement;
        //   scollableDiv.scrollTop = scollableDiv.scrollHeight;
        // }, 1000);
      }
      this.ref.detectChanges();
    }, 0);
  }
}
