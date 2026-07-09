import { QtiChoiceInteraction } from '@citolab/qti-components';
import { css } from 'lit';
import type { PropertyValues } from 'lit';

import { applyDiggelImageConstraints } from '../transform/diggelImageConstraints';
import { injectLikeChoiceStyles } from '../styles/injectQtiStyles';
import { mergeStyles } from '../styles/typeInteractionStyles';

const likeInteractionStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  ::slotted(qti-prompt) {
    font-weight: 600;
    margin: 1rem 0 0.5rem;
  }

  ::slotted(qti-simple-choice) {
    display: block;
    width: 100%;
  }
`;

type LikeChoice = HTMLElement & {
  internals?: ElementInternals;
};

/**
 * Like-button style choice interaction (workflow item).
 * Authored as: <qti-choice-interaction class="type:like" ...>
 *
 * Liked + readonly state comes from the component itself — `response` (the liked
 * choice, set through the item context) and `readonly` (pushed down by
 * qti-assessment-item) — so history posts render without an external scheduler.
 */
export class QtiChoiceInteractionLike extends QtiChoiceInteraction {
  static override styles = mergeStyles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (QtiChoiceInteraction as any).styles,
    likeInteractionStyles
  );

  #likedTokens(): Set<string> {
    const value = this.response;
    if (value == null || value === '') return new Set();
    const raw = Array.isArray(value) ? value.join(' ') : String(value);
    return new Set(
      raw
        .split(/[\s,]+/)
        .map((token) => token.trim())
        .filter(Boolean)
    );
  }

  #syncLike = () => {
    applyDiggelImageConstraints(this);

    const tokens = this.#likedTokens();
    this.querySelectorAll('qti-simple-choice').forEach((choice) => {
      const el = choice as LikeChoice;
      const identifier = choice.getAttribute('identifier');
      const liked =
        (identifier != null && tokens.has(identifier)) ||
        el.getAttribute('aria-checked') === 'true' ||
        Boolean(el.internals?.states.has('--checked'));
      choice.toggleAttribute('data-liked', liked);
      choice.toggleAttribute('data-readonly-like', this.readonly);
    });

    injectLikeChoiceStyles(this);
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.#syncLike);
    this.addEventListener('qti-interaction-changed', this.#syncLike);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#syncLike);
    this.removeEventListener('qti-interaction-changed', this.#syncLike);
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    this.#syncLike();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qti-choice-interaction-like': QtiChoiceInteractionLike;
  }
}

if (!customElements.get('qti-choice-interaction-like')) {
  customElements.define(
    'qti-choice-interaction-like',
    QtiChoiceInteractionLike
  );
}
