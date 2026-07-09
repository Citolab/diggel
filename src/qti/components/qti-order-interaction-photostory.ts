import { QtiOrderInteraction } from '@citolab/qti-components';
import { css, html, nothing } from 'lit';

import { mergeStyles } from '../styles/typeInteractionStyles';

type Step = { identifier: string; url: string };

const photostoryStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  /* --- Composer stage (placeholder / slideshow) --- */
  .photostory__stage {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #e9ebee;
  }

  .photostory__placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: #b0b3b8;
  }

  .photostory__placeholder svg {
    width: 96px;
    height: 96px;
  }

  .photostory__slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  .photostory__slide[data-active] {
    opacity: 1;
  }

  .photostory__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--env-primary, #428beb);
    border-radius: 0.375rem;
    background: #fff;
    color: var(--env-primary, #428beb);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .photostory__button:hover {
    background: var(--env-primary, #428beb);
    color: #fff;
  }

  .photostory__button svg {
    width: 20px;
    height: 20px;
  }

  /* --- Picker dialog: slides in as a drawer from the left --- */
  dialog.photostory-modal {
    width: min(560px, 100vw);
    height: 100dvh;
    max-height: 100dvh;
    /* stick to the left edge instead of centering */
    margin: 0 auto 0 0;
    padding: 0;
    border: none;
    border-radius: 0;
    box-shadow: 12px 0 40px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    /* slide + fade, incl. exit (allow-discrete keeps it during close) */
    transform: translateX(-100%);
    transition:
      transform 0.3s ease,
      overlay 0.3s ease allow-discrete,
      display 0.3s ease allow-discrete;
  }

  dialog.photostory-modal[open] {
    transform: translateX(0);
  }

  /* entry starting point (before [open] applies) */
  @starting-style {
    dialog.photostory-modal[open] {
      transform: translateX(-100%);
    }
  }

  dialog.photostory-modal::backdrop {
    background: rgba(0, 0, 0, 0);
    transition:
      background-color 0.3s ease,
      overlay 0.3s ease allow-discrete,
      display 0.3s ease allow-discrete;
  }

  dialog.photostory-modal[open]::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  @starting-style {
    dialog.photostory-modal[open]::backdrop {
      background: rgba(0, 0, 0, 0);
    }
  }

  .photostory-modal__panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100dvh;
  }

  .photostory-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e4e6eb;
  }

  .photostory-modal__title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1c1e21;
  }

  .photostory-modal__title svg {
    width: 24px;
    height: 24px;
  }

  .photostory-modal__close {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    color: #1c1e21;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
  }

  .photostory-modal__close:hover {
    background: #f0f2f5;
  }

  .photostory-modal__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-content: start;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    overflow: auto;
    /* fill the drawer so the footer anchors to the bottom */
    flex: 1;
  }

  .photostory-cell {
    position: relative;
    aspect-ratio: 1 / 1;
    border: 3px solid transparent;
    border-radius: 0.375rem;
    overflow: hidden;
    padding: 0;
    background: #f0f2f5;
    cursor: pointer;
  }

  .photostory-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .photostory-cell[data-selected] {
    border-color: var(--env-primary, #428beb);
  }

  .photostory-cell[data-selected]::after {
    content: '';
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--env-primary, #428beb) 22%, transparent);
  }

  .photostory-cell__badge {
    position: absolute;
    left: 8px;
    bottom: 8px;
    z-index: 1;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    background: var(--env-primary, #428beb);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .photostory-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    padding: 0.9rem 1.25rem;
    border-top: 1px solid #e4e6eb;
    background: #f7f8fa;
  }

  .photostory-modal__footer button {
    padding: 0.5rem 1.1rem;
    border-radius: 0.375rem;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .photostory-btn--ghost {
    border: 1px solid var(--env-primary, #428beb);
    background: #fff;
    color: var(--env-primary, #428beb);
  }

  .photostory-btn--primary {
    border: 1px solid var(--env-primary, #428beb);
    background: var(--env-primary, #428beb);
    color: #fff;
  }
`;

const imageStackIcon = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      d="M21 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2Zm-8.5 6.5-2 2.51L9 12.5 6.5 16H19l-3.5-4.5ZM4 7H2v12a2 2 0 0 0 2 2h12v-2H4V7Z"
    />
  </svg>
`;

const pencilIcon = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83ZM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
    />
  </svg>
`;

const apertureIcon = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path
      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 2a8 8 0 0 1 3.3.72L11 11.05 8.2 6.2A8 8 0 0 1 12 4Zm-6.28 3.2L8.5 12l-5.34.9A8 8 0 0 1 5.72 7.2ZM4 12l.05-.02L10.6 13l-3.34 4.6A8 8 0 0 1 4 12Zm8 8a8 8 0 0 1-3.3-.72L13 12.95l2.8 4.85A8 8 0 0 1 12 20Zm6.28-3.2L15.5 12l5.34-.9a8 8 0 0 1-2.56 5.7ZM13.4 11l3.34-4.6a8 8 0 0 1 3.21 5.58Z"
    />
  </svg>
`;

/**
 * Photo-story order interaction (tie-a-knot item).
 * Authored as: `<qti-order-interaction class="type:photostory" ...>` where each
 * `<qti-simple-choice>` carries the step image.
 *
 * A grey stage shows a placeholder until photos are chosen, then an auto-playing
 * slideshow of the selected images in order. The "Photo story" button opens a
 * picker where images are tapped into order (with N/total badges). Confirming
 * commits the ordered identifiers through the item context via `saveResponse`,
 * so scoring/response-processing works like any QTI order interaction. Readonly
 * history posts show just the slideshow.
 */
export class QtiOrderInteractionPhotostory extends QtiOrderInteraction {
  static override styles = mergeStyles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (QtiOrderInteraction as any).styles,
    photostoryStyles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;

  /** Draft order while the picker is open; committed to the response on OK. */
  private draft: string[] = [];
  private slide = 0;

  #slideTimer?: number;

  private get dialogEl(): HTMLDialogElement | null {
    return this.renderRoot?.querySelector('dialog.photostory-modal') ?? null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#slideTimer = window.setInterval(() => {
      const count = this.#committedOrder.length;
      if (count > 1) {
        this.slide = (this.slide + 1) % count;
        this.requestUpdate();
      }
    }, 2500);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.#slideTimer !== undefined) {
      window.clearInterval(this.#slideTimer);
    }
  }

  /** Step data (identifier + image url) read from the authored choices. */
  get #steps(): Step[] {
    return Array.from(this.querySelectorAll('qti-simple-choice'))
      .map((choice) => ({
        identifier: choice.getAttribute('identifier') ?? '',
        url: choice.querySelector('img')?.getAttribute('src') ?? '',
      }))
      .filter((step) => step.identifier);
  }

  /**
   * Committed ordered identifiers, read from the item context (the source of
   * truth). Reactive: updates re-render the stage. Works both live (after
   * saveResponse updates the context) and for restored readonly history.
   */
  get #committedOrder(): string[] {
    const value = this.responseVariable?.value;
    return Array.isArray(value) ? value : value ? [String(value)] : [];
  }

  #stepsInOrder(order: string[]): Step[] {
    const byId = new Map(this.#steps.map((step) => [step.identifier, step]));
    return order
      .map((identifier) => byId.get(identifier))
      .filter((step): step is Step => Boolean(step));
  }

  #openPicker = async () => {
    this.draft = [...this.#committedOrder];
    this.requestUpdate();
    await this.updateComplete;
    this.dialogEl?.showModal();
  };

  #cancelPicker = () => this.dialogEl?.close();

  #confirmPicker = () => {
    this.saveResponse([...this.draft]);
    this.slide = 0;
    this.requestUpdate();
    this.dialogEl?.close();
  };

  #toggleStep(identifier: string) {
    const index = this.draft.indexOf(identifier);
    if (index === -1) {
      if (this.draft.length >= this.#steps.length) return;
      this.draft = [...this.draft, identifier];
    } else {
      // Removing renumbers the rest automatically (badge = position + 1).
      this.draft = this.draft.filter((id) => id !== identifier);
    }
    this.requestUpdate();
  }

  #renderStage() {
    const ordered = this.#stepsInOrder(this.#committedOrder);
    if (ordered.length === 0) {
      return html`
        <div class="photostory__stage">
          <div class="photostory__placeholder">${imageStackIcon}</div>
        </div>
      `;
    }

    const active = this.slide % ordered.length;
    return html`
      <div class="photostory__stage">
        ${ordered.map(
          (step, index) => html`
            <img
              class="photostory__slide"
              src="${step.url}"
              alt=""
              ?data-active="${index === active}"
            />
          `
        )}
      </div>
    `;
  }

  #renderPicker() {
    const total = this.#steps.length;
    return html`
      <dialog class="photostory-modal" @cancel="${this.#cancelPicker}">
        <div class="photostory-modal__panel">
          <div class="photostory-modal__header">
            <h4 class="photostory-modal__title">${apertureIcon} Select images</h4>
            <button
              class="photostory-modal__close"
              type="button"
              aria-label="Close"
              @click="${this.#cancelPicker}"
            >
              ×
            </button>
          </div>

          <div class="photostory-modal__grid">
            ${this.#steps.map((step) => {
              const position = this.draft.indexOf(step.identifier);
              const selected = position !== -1;
              return html`
                <button
                  class="photostory-cell"
                  type="button"
                  ?data-selected="${selected}"
                  @click="${() => this.#toggleStep(step.identifier)}"
                >
                  <img src="${step.url}" alt="" />
                  ${selected
                    ? html`<span class="photostory-cell__badge"
                        >${position + 1}/${total}</span
                      >`
                    : nothing}
                </button>
              `;
            })}
          </div>

          <div class="photostory-modal__footer">
            <button
              class="photostory-btn--ghost"
              type="button"
              @click="${this.#cancelPicker}"
            >
              Cancel
            </button>
            <button
              class="photostory-btn--primary"
              type="button"
              @click="${this.#confirmPicker}"
            >
              Ok
            </button>
          </div>
        </div>
      </dialog>
    `;
  }

  override render() {
    // Once an order exists, the button re-opens the picker to edit it (pre-filled
    // with the current selection) — a clear affordance to change it before posting.
    const hasOrder = this.#committedOrder.length > 0;

    return html`
      ${this.#renderStage()}
      ${this.readonly
        ? nothing
        : html`
            <button
              class="photostory__button"
              type="button"
              @click="${this.#openPicker}"
            >
              ${hasOrder ? pencilIcon : imageStackIcon}
              ${hasOrder ? 'Edit photo story' : 'Photo story'}
            </button>
            ${this.#renderPicker()}
          `}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qti-order-interaction-photostory': QtiOrderInteractionPhotostory;
  }
}

if (!customElements.get('qti-order-interaction-photostory')) {
  customElements.define(
    'qti-order-interaction-photostory',
    QtiOrderInteractionPhotostory
  );
}
