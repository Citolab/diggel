# Diggel (QTI version)

A React + TypeScript rebuild of the Diggel social-media training application, driven
by a **valid QTI 3 package** and rendered with [`@citolab/qti-components`](https://github.com/Citolab/qti-components).
Both environments (Spacebook / Spacegram) run from one app with **environment themes**
instead of separate apps.

**Live demo:** https://citolab-diggel-demo.web.app

## Background

The original Diggel is an Angular monorepo — you can find it on the
[`angular` branch](https://github.com/Citolab/diggel/tree/angular).

At the time it was built, our own QTI player ([`@citolab/qti-components`](https://github.com/Citolab/qti-components))
wasn't ready to use yet, so it was faster to model each item as a **custom Angular
component** and each environment as a **separate app**.

Now that `qti-components` is much further along, this version delivers what we always
had in mind: build the Diggel application from a **QTI assessment package** and get the
social-media look purely by **extending the standard QTI interactions** — no bespoke
item components, no DOM scraping. The assessment structure, items, sections and
navigation are all authored as QTI; the app just themes and arranges them.

## Quick start

```bash
npm install
npm run dev
```

1. Accept terms → **Go to demo**
2. Pick **Spacebook** or **Spacegram**
3. Follow Susan through the registration and feed items

## QTI package as the source of truth

Each environment is a QTI assessment test (`public/packages/<env>/assessment-test.xml`)
with three sections that drive the app phases:

| Section | Role |
|---|---|
| `registration` | The "follow news pages" item, with a wizard sidebar in a rubric block |
| `welcome` | A single info item (no interaction) — the welcome hero |
| `feed` | The feed items, shown one by one; answered ones stay on the page |

`loadAssessmentStructure()` reads the item list, order, sections and `info` category
straight from the test. App-only presentation metadata that isn't part of the QTI spec
(post author, display title) lives in `data-*` attributes on the `qti-assessment-item-ref`s.
There is no hand-maintained item registry.

## Extending the interactions

The social-media styling comes from **extended QTI interactions**, not custom widgets.
Authoring stays valid QTI: an interaction (or element) carries a `class="type:<name>"`,
and `extendElementsWithClass('type')` upgrades it to a registered web component that
`extends` the stock `@citolab/qti-components` interaction — inheriting all response
handling, and only adding presentation. State is read/written through the item context
(`variables`), never by scraping the DOM.

| Authored QTI | Becomes | Looks like |
|---|---|---|
| `<qti-extended-text-interaction class="type:comment">` | `qti-extended-text-interaction-comment` | "Write a comment" field / a posted comment |
| `<qti-choice-interaction class="type:poll">` | `qti-choice-interaction-poll` | A poll with revealed result bars |
| `<qti-choice-interaction class="type:like">` | `qti-choice-interaction-like` | Like/heart the best suggestion |
| `<qti-choice-interaction class="type:follow">` | `qti-choice-interaction-follow` | Follow-pages list (registration) |
| `<qti-order-interaction class="type:photostory">` | `qti-order-interaction-photostory` | Order photos into a photo story |
| `<div class="type:susan">` | `div-susan` | Susan's chat notification |
| `<div class="type:registration-steps">` | `div-registration-steps` | Registration wizard sidebar |

Items are upgraded via the item transform (`postLoadTransformCallback`); the test itself
(e.g. the registration-steps rubric) via the test transform (`postLoadTestTransformCallback`).

## One app, two environments

Instead of separate apps, each environment is configured in `src/environments/config.ts`:

| | Spacebook | Spacegram |
|---|---|---|
| Primary colour | `#428beb` | `#d65db1` |
| Layout | Facebook-style (sidebar + feed) | Instagram-style (followers aside) |
| Persona | Susan | Susie Frusie |
| Like icon | Thumb | Heart |

`EnvironmentProvider` sets `data-environment` on `<html>`; the theme variables
(`--env-primary`, etc.) come from CSS keyed on that attribute. Add a new environment by
extending `ENVIRONMENTS`, adding a QTI package, and adding CSS rules.

## Routes

The whole assessment runs on **one page**, keyed on the active QTI section:

| Path | Screen |
|---|---|
| `/` | Login (terms + Go to demo) |
| `/welcome` | Pick Spacebook or Spacegram |
| `/:env` | The assessment — start → registration → welcome → feed → end, chosen by the session phase (derived from the active section) |

## Assets

Copied from the original monorepo (not the live site):

| Source | Destination |
|---|---|
| `diggel/frontend/apps/spacebook/src/assets/` | `public/assets/spacebook/` |
| `diggel/frontend/apps/spacegram/src/assets/` | `public/assets/spacegram/` |
| `diggel/frontend/apps/diggel/src/assets/omgevingen/` | `public/assets/diggel/omgevingen/` |
| `diggel/frontend/apps/diggel/src/assets/partnerlogos/` | `public/assets/diggel/partnerlogos/` |

QTI items reference `assets/items/…` paths; the transform rewrites them to the active
environment's `assetBase`.
