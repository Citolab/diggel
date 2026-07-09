import { qtiTransform } from '@citolab/qti-convert/qti-transformer';
import { qtiTransformItem } from '@citolab/qti-components/qti-transformers';

export interface ProcessedQtiItem {
  itemDoc: DocumentFragment;
  rawXml: string;
}

/** Class prefix used with extendElementsWithClass — e.g. class="type:susan" */
export const TYPE_CLASS_PREFIX = 'type';

import { applyDiggelImageConstraints } from './diggelImageConstraints';
import {
  restoreAnimatedSvgObjects,
  shieldAnimatedSvgObjects,
} from './preserveAnimatedSvgObjects';
import { resolveDiggelAssetUrl } from './resolveDiggelAssetUrl';

/**
 * Fetch and transform a QTI item for the Diggel player.
 *
 * Uses extendElementsWithClass('type') so authored markup like
 * `<div class="type:susan">` becomes `<div-susan>` at runtime.
 */
export interface ProcessQtiItemOptions {
  /** e.g. /assets/spacebook — rewrites assets/items/… paths */
  assetBase?: string;
}

export async function processQtiItem(
  href: string,
  options: ProcessQtiItemOptions = {}
): Promise<ProcessedQtiItem> {
  const response = await fetch(href);
  if (!response.ok) {
    throw new Error(`Failed to fetch item: ${href}`);
  }

  const rawXml = await response.text();

  let transformedContent = qtiTransform(shieldAnimatedSvgObjects(rawXml))
    .qbCleanup()
    .objectToImg()
    .depConvertExtended()
    .minChoicesToOne()
    .changeAssetLocation((assetHref) =>
      resolveDiggelAssetUrl(assetHref, options.assetBase ?? '', href)
    )
    .xml();

  transformedContent = restoreAnimatedSvgObjects(transformedContent);

  const inlined = await qtiTransform(transformedContent).stylesheetsInline();
  let doc = qtiTransformItem().parse(inlined.xml());

  // div.type:susan → div-susan, qti-choice-interaction.type:poll → qti-choice-interaction-poll, etc.
  doc = doc.extendElementsWithClass(TYPE_CLASS_PREFIX);

  const parsed = new DOMParser().parseFromString(doc.xml(), 'application/xml');
  parsed.querySelectorAll('qti-item-body').forEach((el) => {
    el.classList.add('custom-qti-style', 'content', 'diggel-item-body');
  });

  parsed.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src) return;
    img.setAttribute(
      'src',
      resolveDiggelAssetUrl(src, options.assetBase ?? '', href)
    );
  });

  parsed.querySelectorAll('object[data]').forEach((objectEl) => {
    const data = objectEl.getAttribute('data');
    if (!data) return;
    objectEl.setAttribute(
      'data',
      resolveDiggelAssetUrl(data, options.assetBase ?? '', href)
    );
  });

  applyDiggelImageConstraints(parsed);

  const serializer = new XMLSerializer();
  const finalDoc = qtiTransformItem().parse(serializer.serializeToString(parsed));

  return {
    itemDoc: finalDoc.htmlDoc(),
    rawXml,
  };
}
