# Frontend

The frontend is an Angular application that can be wrapped into a Cordova app.

Spacebook was created first. A year later, Spacebook changed a bit and there new applications were added. The frontend now has a login application. 
After login the user will be redirected to the assigned application.

All projects are using shared services and apart from the UI the way of creating and 
showing items doesn't differ much. 

## Application/ assessment

An application equals an assessment with items.

### Items

Each application has an items.ts file in src/app/items/items.ts. 
This file contains the item definition.
The items are presented in the same order as the are added in itemDefinition.

```ts 
export const itemDefinitions: ItemDefinition[] = [...registrationItems, ...feedItems];
```

After an item is submitted, the next item of the itemDefinition array will be presented.

Creating and adding an item on a page dynamically caused some difficulties.
Circular reference, aot build etc.. makes it diffult to find a way to register items
with a less as administration as possible. This way items are created now:

Items are create by:

- implementing ItemComponent
- in items.ts declare the item by: { id: --id--, component: import('./---ref-to---.component') },
- it should be added as a declarion in the ItemModule

When a new item should be presented it will retrieve the Type of the Component from the list.
and created and added like this:
```ts 
const factory = this.resolver.resolveComponentFactory(component);
const itemComponent = this.container.createComponent(factory);
```

Different pages have different ways of showing items:

- Single mode (e.g. registation page): Just one item on the page. If a new item is added, the previous one will be removed.
- Multiple items: If a next item is presented the previous one will still be on the page, but in read only mode. By default, a next item will be presented below the previous one. If you set PlaceOnTop = true, new items will appear on top. There are implementation like in WebSpace: web-page.component where the item, after it's added to the page, will be moved into a HTMLelement.
When the ItemCompontent.location || ItemComponent.id matches a div id, it will be place into that HTMLelement. If there is already an item there, it will be removed. This is used in cases where there are multiple items for one text/image.

Some items are to inform the user or to make transitions to items more authentic. These items are marked as info items (ItemUsage.info).

### Pages

An item is assigned to a theme. E.g. ItemThemeType.registration. This enum should match a route.
The following steps should be taken when creating a new page where items are added.

- Create a new component that extends BasePageComponent
- add <template #itemContainer></template> in the html (even if it's relocated later)
- make sure the following fieds are overridden 
    - ItemModule: this should point to the modules that declared the ItemComponents
    - itemDefinitions: itemDefinitions for this project (e.g. for Spacebook);
    - itemComponents: itemDefinitions filtered by Theme
- add an enum value in ItemThemeType
- add a route that matches the ItemThemeType name.
- optional: override logic of the BasePageComponent and customize the Html in the page.
 
# Cordova

The folder /app contains the cordova wrapper. The dist folder's of the different Angular projects are copied to the www folder. Before the apk is build the index.html will be injected with cordova.js. By checking if the js file is loaded the Angular application knows if its running in Cordova or in the Browser.

#




