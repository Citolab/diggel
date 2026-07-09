const ANIMATED_OBJECT_SELECTOR =
  'object[type^="image"][class*="welcome-hero__rocket"], object[type^="image"][data*="rocket.svg"]';

/** Hide animated SVG objects from objectToImg (which only matches type^="image"). */
export function shieldAnimatedSvgObjects(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  doc.querySelectorAll(ANIMATED_OBJECT_SELECTOR).forEach((objectEl) => {
    const type = objectEl.getAttribute('type');
    if (!type) return;
    objectEl.setAttribute('data-diggel-object-type', type);
    objectEl.setAttribute('type', 'text/plain');
  });
  return new XMLSerializer().serializeToString(doc);
}

/** Restore MIME types after objectToImg so the browser can render the SVG animation. */
export function restoreAnimatedSvgObjects(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  doc.querySelectorAll('object[data-diggel-object-type]').forEach((objectEl) => {
    const type = objectEl.getAttribute('data-diggel-object-type');
    if (type) objectEl.setAttribute('type', type);
    objectEl.removeAttribute('data-diggel-object-type');
  });
  return new XMLSerializer().serializeToString(doc);
}
