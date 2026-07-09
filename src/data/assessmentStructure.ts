import type { ItemDefinition, ItemUsage } from '../types';

/** Meta shape the QtiTestPlayer needs to seed its test context. */
export interface TestPlayerItemMeta {
  identifier: string;
  title: string;
  usage: ItemUsage;
}

/**
 * Load the app's item structure directly from the QTI assessment test — the
 * single source of truth. Walks `qti-assessment-item-ref`s in document order,
 * deriving section membership, info/regular from `category`, and resolving each
 * item href against the test URL. Non-QTI presentation metadata (author, display
 * title) is read from `data-*` attributes on the refs.
 */
export async function loadAssessmentStructure(
  testUrl: string
): Promise<ItemDefinition[]> {
  const response = await fetch(testUrl);
  if (!response.ok) {
    throw new Error(`Failed to load assessment test: ${testUrl}`);
  }

  const xml = await response.text();
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error(`Invalid assessment test XML: ${testUrl}`);
  }

  const base = new URL(
    testUrl,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  );

  const items: ItemDefinition[] = [];
  doc.querySelectorAll('qti-assessment-item-ref').forEach((ref) => {
    const id = ref.getAttribute('identifier');
    const href = ref.getAttribute('href');
    if (!id || !href) return;

    const section =
      ref.closest('qti-assessment-section')?.getAttribute('identifier') ?? '';
    const category = ref.getAttribute('category') ?? '';
    const usage: ItemUsage = category.split(/\s+/).includes('info')
      ? 'info'
      : 'regular';

    items.push({
      id,
      href: new URL(href, base).pathname,
      title: ref.getAttribute('data-title') ?? id,
      usage,
      section,
      author: ref.getAttribute('data-author') ?? undefined,
    });
  });

  return items;
}

export function toTestPlayerItems(
  items: ItemDefinition[]
): TestPlayerItemMeta[] {
  return items.map((item) => ({
    identifier: item.id,
    title: item.title,
    usage: item.usage,
  }));
}
