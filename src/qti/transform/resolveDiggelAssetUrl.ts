/** Normalize item href from the test package to an absolute directory URL. */
export function resolveItemBaseUrl(href: string): string {
  const normalized = href.replace(/\\/g, '/');
  try {
    return new URL(normalized, window.location.origin).href.replace(
      /[^/]+$/,
      ''
    );
  } catch {
    const lastSlash = normalized.lastIndexOf('/');
    if (lastSlash < 0) return `${window.location.origin}/`;
    return new URL(
      normalized.slice(0, lastSlash + 1),
      window.location.origin
    ).href;
  }
}

/**
 * Rewrite QTI asset paths for Diggel environments.
 * Returns absolute URLs so the QTI player does not turn `/assets/...` into `//assets/...`.
 */
export function resolveDiggelAssetUrl(
  assetHref: string,
  assetBase: string,
  itemHref: string
): string {
  if (
    !assetHref ||
    /^https?:\/\//i.test(assetHref) ||
    assetHref.startsWith('data:')
  ) {
    return assetHref;
  }

  let path: string;

  if (assetBase && assetHref.startsWith('assets/')) {
    const cleanBase = assetBase.replace(/\/$/, '');
    path = `${cleanBase}/${assetHref.slice('assets/'.length)}`;
  } else {
    try {
      path = new URL(assetHref, resolveItemBaseUrl(itemHref)).pathname;
    } catch {
      return assetHref;
    }
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return new URL(path, window.location.origin).href;
}

/** Fix broken protocol-relative paths like //assets/spacebook/... in rendered DOM. */
export function fixBrokenAssetUrls(root: ParentNode): void {
  const fixSrc = (src: string | null): string | null => {
    if (!src || !src.startsWith('//')) return src;
    if (/^\/\/[a-z][a-z0-9+.-]*:/i.test(src)) return src;
    const path = `/${src.replace(/^\/+/, '')}`;
    return new URL(path, window.location.origin).href;
  };

  root.querySelectorAll('img[src]').forEach((img) => {
    const fixed = fixSrc(img.getAttribute('src'));
    if (fixed && fixed !== img.getAttribute('src')) {
      img.setAttribute('src', fixed);
    }
  });

  root.querySelectorAll('object[data]').forEach((objectEl) => {
    const fixed = fixSrc(objectEl.getAttribute('data'));
    if (fixed && fixed !== objectEl.getAttribute('data')) {
      objectEl.setAttribute('data', fixed);
    }
  });

  root.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) {
      fixBrokenAssetUrls(el.shadowRoot);
    }
  });
}

/** QTI may inject //assets/... after connect — retry until images resolve. */
export function scheduleAssetUrlFix(root: ParentNode | null | undefined): void {
  if (!root) return;

  const run = () => fixBrokenAssetUrls(root);
  for (const delay of [0, 50, 250, 500, 1000, 2000]) {
    if (delay === 0) {
      run();
      requestAnimationFrame(run);
    } else {
      window.setTimeout(run, delay);
    }
  }
}
