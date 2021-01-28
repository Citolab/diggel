# Diggel - frontend

This application is generated using [Nx](https://nx.dev). It's an Angular application that can be wrapped into a Cordova app.

Spacebook was created first. A year later, Spacebook was changed a bit and 3 new applications were added.

## Current state

This application is a copy of the original application that contain items<sup>[1](#fn1)</sup> that can't be released yet.

All original items have been removed. 5 example items have been created and added to *Spacebook* and *Spacegram*.
Because everything in the application was in Dutch we did some translations, but you might find some Dutch left here and there.

The application is build to run on a specific Samsung tablet. Resolutions/aspect ratios other than this tablet's aren't tested.

TODO:
- Add items for *WebSpace* and *SpaceTalk*.
- We're thinking about integrating a QTI player to be able to play QTI package instead of items as Angular components

## Application / assessment

One application equals an assessment with items.

### Items<sup>[1](#fn1)</sup>

Each application has an `items.ts` file in `src/app/items/`. This file contains the item definitions. The items are presented in the same order as they are added in `itemDefinitions`.

```ts 
export const itemDefinitions: ItemDefinition[] = [...registrationItems, ...feedItems];
```

After an item is submitted, the next item of the itemDefinition array will be presented.

### Steps to create new items:

- Add a new component that implement the `ItemComponent` interface
- In `items.ts` declare the item by: `{ id: --id--, component: import('./---ref-to---.component') }`
- Add the `ItemComponent` to the declarions in the `ItemModule`

When a new item should be presented it will retrieve the Type of the Component from the list.
and created and added like this:

```ts 
const factory = this.resolver.resolveComponentFactory(component);
const itemComponent = this.container.createComponent(factory);
```

Different pages have different ways of showing items:

- Single mode (e.g. registration page): Just one item on the page. If a new item is added, the previous one will be removed.
- Multiple items: If a next item is presented the previous one will still be on the page, but in read only mode. By default, a next item will be presented below the previous one. If you set `PlaceOnTop = true`, new items will appear on top. There are implementations like in *WebSpace*: `web-page.component` where the item, after it's been added to the page, will be moved into a specific `HTMLElement`.
When the `ItemCompontent.location || ItemComponent.id` matches a  `div` id, it will be place into that `HTMLElement`. If there is already an item there, it will be removed. This is used in cases where there are multiple items for one text/image.

Some items are to inform the user or to make transitions to items more authentic. These items are marked as info items (`ItemUsage.info`).

### Pages

An item is assigned to a theme. E.g. `ItemThemeType.registration`. This enum should match a route.
The following steps should be taken when creating a new page where items are added.

- Create a new component that extends `BasePageComponent`
- add `<template #itemContainer></template>` in the html (even if it's relocated later)
- make sure the following fieds are overridden 
    - `ItemModule`: this should point to the modules that declared the `ItemComponent`s
    - `itemDefinitions`: itemDefinitions for this project (e.g. for *Spacebook*);
    - `itemComponents`: itemDefinitions filtered by Theme
- add an enum value in `ItemThemeType`
- add a route that matches the `ItemThemeType` name.
- optional: override logic of the `BasePageComponent` and customize the Html in the page.
 
# Cordova (tools/android-app)

In a normal browser it's not possible to extensively log which steps a user takes to search for the correct answer. Cordova wraps a webapplication in an Android app. It has its own browser that allows scripts to be injected into websites. Everytime a user navigates to a website, a javascript file is injected that logs clicks, key-strokes and navigation events.
These log entries are sent to the backend and stored in the log collection in Mongo. This data can be used to analyze which path students take to find the correct answer.

There are several scripts that run while creating the apk:
- add gradle options
- `cordova.js` is added to `index.html` of all applications.
- update the version of the apk using the date to be sure it's always a newer version. [AppUpdate] (https://github.com/vaenow/cordova-plugin-app-update) is used to auto update.
- rename the apk to `diggel.apk`
- Move the apk to a release folder.

`apk:build`/`apk:nobuild` builds an apk file that can be installed on a android tablet.

***
### Footnotes
<a name="fn1">1</a>: An 'item' in this context is educational lingo for a test question or assignment.