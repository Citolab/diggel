import { css, html, LitElement } from 'lit';

export const DIGGEL_SUSAN_READY = 'diggel-susan-ready';

export type DiggelSusanReadyDetail = {
  html: string;
};

/**
 * Susan notification carrier. Authored as:
 *   <div class="type:susan"><p>Hi! Can you help me?</p></div>
 * Transformed to <div-susan> via extendElementsWithClass('type').
 *
 * Hidden in the item; content is shown in the Susan toast instead.
 */
export class DivSusan extends LitElement {
  static styles = css`
    :host {
      display: none !important;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    this.dispatchSusanReady();
  }

  private dispatchSusanReady(): void {
    const html = this.innerHTML.trim();
    if (!html) return;

    this.dispatchEvent(
      new CustomEvent<DiggelSusanReadyDetail>(DIGGEL_SUSAN_READY, {
        bubbles: true,
        composed: true,
        detail: { html },
      })
    );
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'div-susan': DivSusan;
  }
}

if (!customElements.get('div-susan')) {
  customElements.define('div-susan', DivSusan);
}
