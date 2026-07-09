import { QtiChoiceInteraction } from '@citolab/qti-components';
import { css } from 'lit';
import type { PropertyValues } from 'lit';

import { injectPollChoiceStyles } from '../styles/injectQtiStyles';
import { syncPollChoiceState } from './pollChoiceState';
import { mergeStyles } from '../styles/typeInteractionStyles';

const pollInteractionStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  [part='slot'] {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  ::slotted(qti-simple-choice) {
    display: block;
    width: 100%;
  }
`;

/**
 * Poll-style choice interaction (funny-video item).
 * Authored as: <qti-choice-interaction class="type:poll" ...>
 *
 * Reveal is driven entirely by the component's own state — `readonly` (pushed
 * down by qti-assessment-item) and `response` (the selected choice, set through
 * the item context). No external scheduler or DOM polling.
 */
export class QtiChoiceInteractionPoll extends QtiChoiceInteraction {
  static override styles = mergeStyles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (QtiChoiceInteraction as any).styles,
    pollInteractionStyles
  );

  /** Guards the one-time bar-in animation so re-renders don't re-trigger it. */
  #hasRevealed = false;

  #responseAsString(): string | undefined {
    const value = this.response;
    if (value == null || value === '') return undefined;
    return Array.isArray(value) ? value.join(' ') : String(value);
  }

  #syncPoll = () => {
    injectPollChoiceStyles(this);
    const savedResponse = this.#responseAsString();

    if (!this.readonly) {
      this.#hasRevealed = false;
      syncPollChoiceState(this, { savedResponse });
      return;
    }

    if (this.#hasRevealed) {
      syncPollChoiceState(this, { savedResponse, forceReveal: true });
      return;
    }

    // Animate the bars in on the first readonly reveal: start at 0%, then fill
    // on the next frame so the CSS width transition plays.
    this.#hasRevealed = true;
    syncPollChoiceState(this, {
      savedResponse,
      forceReveal: true,
      deferReveal: true,
    });
    requestAnimationFrame(() => {
      syncPollChoiceState(this, { savedResponse, forceReveal: true });
      injectPollChoiceStyles(this);
    });
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.#syncPoll);
    this.addEventListener('qti-interaction-changed', this.#syncPoll);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#syncPoll);
    this.removeEventListener('qti-interaction-changed', this.#syncPoll);
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    this.#syncPoll();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qti-choice-interaction-poll': QtiChoiceInteractionPoll;
  }
}

if (!customElements.get('qti-choice-interaction-poll')) {
  customElements.define(
    'qti-choice-interaction-poll',
    QtiChoiceInteractionPoll
  );
}
