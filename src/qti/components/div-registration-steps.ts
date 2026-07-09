import { css, html, LitElement } from 'lit';

import { REGISTRATION_STEPS } from '../../data/items';

/**
 * Registration wizard sidebar — authored in a section rubric block as valid QTI:
 *   <div class="type:registration-steps" data-active-step="5"></div>
 * The test-level transform (extendElementsWithClass) upgrades it to
 * <div-registration-steps> at load, mirroring how items handle type:* classes.
 */
export class DivRegistrationSteps extends LitElement {
  activeStep = 5;

  static styles = css`
    :host {
      display: block;
    }

    .registration-sidebar {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .registration-sidebar__step {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--env-primary-light, #5a9bef);
      color: #fff;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .registration-sidebar__step--active {
      background: #fff;
      color: #212529;
      font-weight: 600;
    }

    .registration-sidebar__badge {
      width: 24px;
      height: 24px;
      min-width: 24px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 0.8rem;
      font-weight: 700;
      background: var(--env-primary, #428beb);
      color: #fff;
    }

    .registration-sidebar__badge--active {
      background: #343a40;
      color: #fff;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    // Authored as data-* (non-QTI attribute) on <div class="type:registration-steps">.
    const raw = this.getAttribute('data-active-step');
    if (raw) {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) {
        this.activeStep = parsed;
      }
    }
  }

  override render() {
    return html`
      <aside class="registration-sidebar">
        ${REGISTRATION_STEPS.map(
          (step, index) => html`
            <div
              class="registration-sidebar__step ${index + 1 === this.activeStep
                ? 'registration-sidebar__step--active'
                : ''}"
            >
              <span
                class="registration-sidebar__badge ${index + 1 === this.activeStep
                  ? 'registration-sidebar__badge--active'
                  : ''}"
                >${index + 1}</span
              >
              ${step}
            </div>
          `
        )}
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'div-registration-steps': DivRegistrationSteps;
  }
}

if (!customElements.get('div-registration-steps')) {
  customElements.define('div-registration-steps', DivRegistrationSteps);
}
