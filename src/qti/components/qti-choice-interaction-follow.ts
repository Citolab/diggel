import { QtiChoiceInteraction } from '@citolab/qti-components';
import { css, html, nothing } from 'lit';
import type { PropertyValues } from 'lit';

import { injectFollowChoiceStyles } from '../styles/injectQtiStyles';
import { applyDiggelImageConstraints } from '../transform/diggelImageConstraints';
import { mergeStyles } from '../styles/typeInteractionStyles';

const followPageStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  .follow-pages__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: #1c1e21;
  }

  ::slotted(qti-simple-choice) {
    width: 100%;
  }
`;

type FollowChoice = HTMLElement & {
  internals?: ElementInternals;
};

function syncFollowingAttributes(interaction: ParentNode) {
  interaction.querySelectorAll('qti-simple-choice').forEach((choice) => {
    const el = choice as FollowChoice;
    const following =
      el.getAttribute('aria-checked') === 'true' ||
      Boolean(el.internals?.states.has('--checked'));
    choice.toggleAttribute('data-following', following);
  });
}

/**
 * Follow-pages interaction for the registration news item.
 * Per-choice row styling is injected into qti-simple-choice shadow roots.
 */
export class QtiChoiceInteractionFollow extends QtiChoiceInteraction {
  static override styles = mergeStyles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (QtiChoiceInteraction as any).styles,
    followPageStyles
  );

  #handleInteractionChange = () => {
    applyDiggelImageConstraints(this);
    syncFollowingAttributes(this);
    injectFollowChoiceStyles(this);
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.#handleInteractionChange);
    this.addEventListener(
      'qti-interaction-changed',
      this.#handleInteractionChange
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#handleInteractionChange);
    this.removeEventListener(
      'qti-interaction-changed',
      this.#handleInteractionChange
    );
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    applyDiggelImageConstraints(this);
    syncFollowingAttributes(this);
    injectFollowChoiceStyles(this);
  }

  override render() {
    const base = super.render();
    return html`
      <h3 class="follow-pages__title">Suggested pages for you</h3>
      ${base ?? nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qti-choice-interaction-follow': QtiChoiceInteractionFollow;
  }
}

if (!customElements.get('qti-choice-interaction-follow')) {
  customElements.define(
    'qti-choice-interaction-follow',
    QtiChoiceInteractionFollow
  );
}
