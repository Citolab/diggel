import { qtiTransform } from '@citolab/qti-convert/qti-transformer';
import {
  qtiTransformItem,
  type transformItemApi,
} from '@citolab/qti-components/qti-transformers';
import type { QtiAssessmentItemRef } from '@citolab/qti-components/qti-test';

import { TYPE_CLASS_PREFIX } from './processQtiItem';
import { applyDiggelImageConstraints } from './diggelImageConstraints';
import {
  restoreAnimatedSvgObjects,
  shieldAnimatedSvgObjects,
} from './preserveAnimatedSvgObjects';
import { resolveDiggelAssetUrl } from './resolveDiggelAssetUrl';

function rewriteAssetHref(
  assetHref: string,
  assetBase: string,
  itemHref: string
): string {
  return resolveDiggelAssetUrl(assetHref, assetBase, itemHref);
}

/**
 * Apply Diggel item transforms inside the QTI test player post-load hook.
 */
export async function applyDiggelItemTransform(
  transformer: transformItemApi,
  itemRef: QtiAssessmentItemRef,
  assetBase: string
): Promise<transformItemApi> {
  const href = itemRef.href ?? '';
  const itemHref = href.startsWith('/') ? href : `/${href}`;

  const transformedContent = restoreAnimatedSvgObjects(
    qtiTransform(shieldAnimatedSvgObjects(transformer.xml()))
      .qbCleanup()
      .objectToImg()
      .depConvertExtended()
      .minChoicesToOne()
      .changeAssetLocation((assetHref) =>
        rewriteAssetHref(assetHref, assetBase, itemHref)
      )
      .xml()
  );

  const inlined = await qtiTransform(transformedContent).stylesheetsInline();
  let doc = qtiTransformItem().parse(inlined.xml());
  doc = doc.extendElementsWithClass(TYPE_CLASS_PREFIX);

  const parsed = new DOMParser().parseFromString(doc.xml(), 'application/xml');
  parsed.querySelectorAll('qti-item-body').forEach((el) => {
    el.classList.add('custom-qti-style', 'content', 'diggel-item-body');
  });

  parsed.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src) return;
    img.setAttribute('src', rewriteAssetHref(src, assetBase, itemHref));
  });

  parsed.querySelectorAll('object[data]').forEach((objectEl) => {
    const data = objectEl.getAttribute('data');
    if (!data) return;
    objectEl.setAttribute('data', rewriteAssetHref(data, assetBase, itemHref));
  });

  applyDiggelImageConstraints(parsed);

  const serializer = new XMLSerializer();
  return qtiTransformItem().parse(serializer.serializeToString(parsed));
}
