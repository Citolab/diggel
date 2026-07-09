import { TYPE_CLASS_PREFIX } from './processQtiItem';

const SUSAN_TAG = 'div-susan';
const SUSAN_CLASS = `${TYPE_CLASS_PREFIX}:susan`;

/**
 * Extract Susan's notification HTML from raw QTI XML (before transform).
 * Looks for <div class="type:susan"> in the source item.
 */
export function extractSusanNotificationFromXml(
  qtiXml: string
): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(qtiXml, 'application/xml');

  if (doc.querySelector('parsererror')) {
    return null;
  }

  const susanDiv = Array.from(doc.querySelectorAll('div')).find((el) =>
    el.classList.contains(SUSAN_CLASS)
  );

  if (!susanDiv) {
    return null;
  }

  return susanDiv.innerHTML.trim() || null;
}

/**
 * Extract Susan's notification from a mounted QTI DOM tree (after render).
 * Looks for <div-susan> (post-transform) and pierces shadow roots.
 */
export function extractSusanNotificationFromDom(
  root: ParentNode
): string | null {
  const walk = (node: ParentNode): Element | null => {
    const direct = node.querySelector(SUSAN_TAG);
    if (direct) {
      return direct;
    }

    for (const el of node.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const found = walk(el.shadowRoot);
        if (found) return found;
      }
    }

    return null;
  };

  const element = walk(root);
  if (!element) {
    return null;
  }

  return element.innerHTML.trim() || null;
}
