# Diggel New

React + TypeScript rewrite of [Diggel](../diggel/) using QTI items and a single app with **environment themes** (Spacebook / Spacegram) instead of separate Angular apps.

## Quick start

```bash
cd new
npm install
npm run dev
```

1. Accept terms → **Go to demo**
2. Pick **Spacebook** or **Spacegram**
3. Follow Susan through registration + feed items

## Assets

Copied from the original monorepo (not the live site):

| Source | Destination |
|---|---|
| `diggel/frontend/apps/spacebook/src/assets/` | `public/assets/spacebook/` |
| `diggel/frontend/apps/spacegram/src/assets/` | `public/assets/spacegram/` |
| `diggel/frontend/apps/diggel/src/assets/omgevingen/` | `public/assets/diggel/omgevingen/` |
| `diggel/frontend/apps/diggel/src/assets/partnerlogos/` | `public/assets/diggel/partnerlogos/` |

QTI items reference `assets/items/…` paths; `processQtiItem()` rewrites them to the active environment's `assetBase`.

## One app, two environments

Instead of separate Angular apps on different ports, each environment is configured in `src/environments/config.ts`:

| | Spacebook | Spacegram |
|---|---|---|
| Primary colour | `#428beb` | `#d65db1` |
| Layout | Facebook-style (sidebar + feed) | Instagram-style (stories + profile aside) |
| Susan name | Susan | Susie Frusie |
| Navbar | White | Brand-coloured |

`EnvironmentProvider` sets `data-environment` on `<html>` and CSS variables (`--env-primary`, etc.). Add a new environment by extending `ENVIRONMENTS` and adding layout rules in CSS.

## QTI type extensions

Uses `extendElementsWithClass('type')` from `@citolab/qti-components`:

```xml
<div class="type:susan">…</div>                         → div-susan
<qti-choice-interaction class="type:poll" …>           → qti-choice-interaction-poll
<qti-choice-interaction class="type:like" …>           → qti-choice-interaction-like
<qti-choice-interaction class="type:follow" …>         → qti-choice-interaction-follow
```

## Routes

| Path | Screen |
|---|---|
| `/` | Login (terms + Go to demo) |
| `/welcome` | Pick Spacebook or Spacegram |
| `/:env/start` | Splash + Start |
| `/:env/registration` | News pages item (wizard sidebar) |
| `/:env/feed` | Feed items (welcome → tangare → workflow → funny-video → tie) |
| `/:env/end` | Finish |
