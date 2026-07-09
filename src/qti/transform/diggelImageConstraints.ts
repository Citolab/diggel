function walkShadowRoots(
  root: ParentNode,
  visit: (node: ParentNode) => void
): void {
  visit(root);
  root.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) {
      walkShadowRoots(el.shadowRoot, visit);
    }
  });
}

/** Inline image sizing — works through QTI shadow DOM (unlike ::slotted nested rules). */
export function applyDiggelImageConstraints(root: ParentNode | Document): void {
  root.querySelectorAll('.like-suggestion').forEach((el) => {
    el.setAttribute(
      'style',
      'display:flex;align-items:flex-start;gap:0.75rem;min-width:0;flex:1;'
    );
  });

  root.querySelectorAll('.follow-page-option').forEach((el) => {
    el.setAttribute(
      'style',
      'display:flex;align-items:center;gap:0.75rem;min-width:0;flex:1;'
    );
  });

  root.querySelectorAll('.like-suggestion__avatar').forEach((img) => {
    img.setAttribute('width', '36');
    img.setAttribute('height', '36');
    img.setAttribute(
      'style',
      'width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;display:block;'
    );
  });

  root.querySelectorAll('.like-suggestion img').forEach((img) => {
    img.setAttribute('width', '36');
    img.setAttribute('height', '36');
    img.setAttribute(
      'style',
      'width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;display:block;'
    );
  });

  root.querySelectorAll('.follow-page-option__thumb').forEach((img) => {
    img.setAttribute('width', '100');
    img.setAttribute('height', '72');
    img.setAttribute(
      'style',
      'width:100px;height:72px;object-fit:contain;flex-shrink:0;display:block;'
    );
  });

  root.querySelectorAll('.verified-badge').forEach((img) => {
    img.setAttribute('width', '13');
    img.setAttribute('height', '13');
    img.setAttribute(
      'style',
      'width:13px;height:13px;object-fit:contain;display:inline-block;flex-shrink:0;margin-left:3px;transform:translateY(0);'
    );
  });

  root.querySelectorAll('qti-item-body img').forEach((img) => {
    if (img.closest('.like-suggestion, .like-suggestion__avatar, .follow-page-option')) return;
    const existing = img.getAttribute('style') ?? '';
    if (/max-width/i.test(existing)) return;
    img.setAttribute(
      'style',
      `${existing}${existing ? ';' : ''}max-width:100%;height:auto;display:block;`.replace(
        /^;/,
        ''
      )
    );
  });
}

/** Walk shadow roots — use when applying after QTI items render in the test player. */
export function applyDiggelImageConstraintsDeep(root: ParentNode): void {
  walkShadowRoots(root, applyDiggelImageConstraints);
}
