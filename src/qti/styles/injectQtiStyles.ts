/**
 * Runtime shadow-DOM style injection for nested QTI web components that have
 * their own shadow roots. Styles in item.css cannot reach inside these hosts.
 *
 * - follow/like/poll choice rows → qti-simple-choice shadow roots
 * - registration layout → qti-assessment-section shadow root
 */
/** Styles injected into each qti-simple-choice shadow root inside follow interactions. */
export const followChoiceShadowStyles = `
  :host {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 1rem;
    width: 100%;
    border: none !important;
    border-bottom: 1px solid #e9ecef !important;
    border-radius: 0 !important;
    padding: 0.75rem 0.5rem !important;
    margin: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
  }

  [part='ch'] {
    display: none !important;
  }

  ::slotted(.follow-page-option) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  ::slotted(.follow-page-option__thumb) {
    display: block;
    width: 100px;
    height: 72px;
    object-fit: contain;
    flex-shrink: 0;
  }

  ::slotted(strong) {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    font-size: 1rem;
    font-weight: 700;
    color: #1c1e21;
    line-height: 1.2;
  }

  ::slotted(.verified-badge) {
    width: 0.8125rem;
    height: 0.8125rem;
    flex-shrink: 0;
    margin-left: 0.15rem;
    object-fit: contain;
    display: inline-block;
    vertical-align: middle;
  }

  ::slotted(p) {
    margin: 0.15rem 0 0;
    color: #6c757d;
    font-size: 0.9rem;
  }

  :host::after {
    content: 'Follow';
    flex-shrink: 0;
    width: 150px;
    text-align: center;
    padding: 0.5rem 1rem;
    border: 2px solid var(--env-primary, #428beb);
    border-radius: 999px;
    color: var(--env-primary, #428beb);
    background: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    box-sizing: border-box;
    pointer-events: none;
  }

  :host(:state(--checked))::after,
  :host([aria-checked='true'])::after,
  :host([data-following])::after {
    content: 'Following';
    background: var(--env-primary, #428beb);
    border-color: var(--env-primary, #428beb);
    color: #fff;
  }
`;

/** Styles injected into qti-simple-choice shadow roots inside like interactions (workflow). */
export const likeChoiceShadowStyles = `
  :host {
    display: flex !important;
    align-items: flex-start !important;
    gap: 0.75rem;
    width: 100%;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 0 0.65rem 0 !important;
    margin: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
  }

  :host([data-readonly-like]) {
    cursor: default;
  }

  [part='ch'] {
    display: none !important;
  }

  ::slotted(.like-suggestion__avatar) {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: block;
  }

  ::slotted(.like-suggestion__bubble) {
    flex: 1;
    min-width: 0;
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 0.35rem 3.75rem 0.35rem 0.75rem;
    box-sizing: border-box;
  }

  :host::after {
    /* thumb-up by default; spacegram overrides to a heart via --like-glyph. */
    content: var(--like-glyph, '\\F0513');
    font-family: 'Material Design Icons';
    font-size: 22px;
    line-height: 1;
    color: var(--env-primary-light, #5a9bef);
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 46px;
    height: 46px;
    border: 2px solid var(--env-primary, #428beb);
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #fff;
    box-sizing: border-box;
    pointer-events: none;
    transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
  }

  :host(:state(--checked))::after,
  :host([aria-checked='true'])::after,
  :host([data-liked])::after {
    background: var(--env-primary, #428beb);
    border-color: var(--env-primary, #428beb);
    color: #fff;
  }
`;

/** Styles injected into qti-simple-choice shadow roots inside poll interactions. */
export const pollChoiceShadowStyles = `
  :host {
    display: block !important;
    width: 100% !important;
    box-sizing: border-box;
    border: 2px solid var(--env-primary, #428beb);
    border-radius: 0.375rem;
    padding: 0.625rem 1rem;
    margin: 0.35rem 0;
    background-color: #fff;
    color: #1c1e21;
    cursor: pointer;
    text-align: left;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s ease, color 0.15s ease,
      background-color 0.15s ease;
  }

  :host([aria-disabled='true']),
  :host([data-poll-readonly]) {
    cursor: default;
  }

  /* While voting (not revealed), hovering or selecting a row inverts its
     colors: filled with the primary color, white text. */
  :host(:not([data-poll-readonly]):hover),
  :host(:not([data-poll-readonly])[aria-checked='true']),
  :host(:not([data-poll-readonly]):state(--checked)) {
    background-color: var(--env-primary, #428beb);
    color: #fff;
  }

  :host::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--poll-percent, 0%);
    background: color-mix(in srgb, var(--env-primary, #428beb) 28%, white);
    transition: width 1s ease;
    pointer-events: none;
    z-index: 0;
  }

  :host(:not([data-poll-reveal]))::before {
    width: 0;
  }

  :host([data-poll-selected]) {
    color: var(--env-primary, #428beb);
    font-weight: 600;
  }

  :host([data-poll-reveal]:not([data-poll-selected])) {
    color: #6c757d;
  }

  [part='ch'] {
    display: none !important;
  }

  slot {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
  }

  ::slotted(p) {
    margin: 0;
    line-height: 1.4;
  }
`;

/** Styles injected into registration qti-assessment-section shadow roots. */
export const registrationSectionShadowStyles = `
  :host {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
    align-items: stretch;
    width: 100%;
  }

  @media (min-width: 768px) {
    :host {
      grid-template-columns: 220px minmax(0, 1fr) 180px;
    }

    :host::after {
      content: '';
      grid-column: 3;
    }
  }

  ::slotted(qti-rubric-block) {
    grid-column: 1;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
  }

  ::slotted(qti-assessment-item-ref) {
    grid-column: 1;
    display: block;
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    min-height: 75vh;
    overflow: auto;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    ::slotted(qti-assessment-item-ref) {
      grid-column: 2;
    }
  }
`;

export function injectStyleSheet(
  root: ShadowRoot | null | undefined,
  id: string,
  cssText: string
): void {
  if (!root || root.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = cssText;
  root.appendChild(style);
}

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

export function injectRegistrationSectionStyles(scope: ParentNode): void {
  walkShadowRoots(scope, (node) => {
    node
      .querySelectorAll('qti-assessment-section[identifier="registration"]')
      .forEach((section) => {
        injectStyleSheet(
          section.shadowRoot,
          'diggel-registration-section-style',
          registrationSectionShadowStyles
        );
      });
  });
}

export function injectFollowChoiceStyles(scope: ParentNode): void {
  walkShadowRoots(scope, (node) => {
    node
      .querySelectorAll('qti-choice-interaction-follow qti-simple-choice')
      .forEach((choice) => {
        const root = choice.shadowRoot;
        if (!root) return;

        const existing = root.getElementById('diggel-follow-choice-style');
        if (existing) {
          // Avoid re-setting identical CSS — it forces a repaint (flicker).
          if (existing.textContent !== followChoiceShadowStyles) {
            existing.textContent = followChoiceShadowStyles;
          }
          return;
        }

        injectStyleSheet(
          root,
          'diggel-follow-choice-style',
          followChoiceShadowStyles
        );
      });
  });
}

export function injectLikeChoiceStyles(scope: ParentNode): void {
  walkShadowRoots(scope, (node) => {
    node
      .querySelectorAll('qti-choice-interaction-like qti-simple-choice')
      .forEach((choice) => {
        const root = choice.shadowRoot;
        if (!root) return;

        const existing = root.getElementById('diggel-like-choice-style');
        if (existing) {
          // Avoid re-setting identical CSS — it forces a repaint (flicker).
          if (existing.textContent !== likeChoiceShadowStyles) {
            existing.textContent = likeChoiceShadowStyles;
          }
          return;
        }

        injectStyleSheet(root, 'diggel-like-choice-style', likeChoiceShadowStyles);
      });
  });
}

export function injectPollChoiceStyles(scope: ParentNode): void {
  walkShadowRoots(scope, (node) => {
    node
      .querySelectorAll('qti-choice-interaction-poll qti-simple-choice')
      .forEach((choice) => {
        const root = choice.shadowRoot;
        if (!root) return;

        const existing = root.getElementById('diggel-poll-choice-style');
        if (existing) {
          // Avoid re-setting identical CSS — it forces a repaint (flicker).
          if (existing.textContent !== pollChoiceShadowStyles) {
            existing.textContent = pollChoiceShadowStyles;
          }
          return;
        }

        injectStyleSheet(root, 'diggel-poll-choice-style', pollChoiceShadowStyles);
      });
  });
}
