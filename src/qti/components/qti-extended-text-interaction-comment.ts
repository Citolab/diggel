import { QtiExtendedTextInteraction } from '@citolab/qti-components';
import { css, html } from 'lit';

import { currentEnvironmentConfig } from '../../environments/config';
import { mergeStyles } from '../styles/typeInteractionStyles';

const commentStyles = css`
  /* Editable state: avatar + pill "Write a comment" field. */
  .comment-input {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
  }

  .comment-input__avatar-ring {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 2px;
    background: var(--env-primary, #428beb);
    box-sizing: border-box;
  }

  .comment-input__avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    background: #fff;
    box-sizing: border-box;
    display: block;
  }

  .comment-input__field {
    flex: 1;
    min-width: 0;
    min-height: 0;
    border: 1px solid #ccd0d5;
    border-radius: 999px;
    padding: 0.55rem 1rem;
    font: inherit;
    font-size: 0.95rem;
    line-height: 1.3;
    color: #1c1e21;
    background: #fff;
    resize: none;
    overflow: hidden;
    box-sizing: border-box;
  }

  .comment-input__field::placeholder {
    color: #8a8d91;
  }

  .comment-input__field:focus {
    outline: none;
    border-color: var(--env-primary, #428beb);
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--env-primary, #428beb) 20%, transparent);
  }

  .diggel-post-reaction {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-top: 1rem;
    width: 100%;
  }

  .diggel-post-reaction__avatar {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .diggel-post-reaction__body {
    flex: 1;
    min-width: 0;
  }

  .diggel-post-reaction__bubble {
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 0.35rem 0.75rem;
  }

  .diggel-post-reaction__name {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    color: #1c1e21;
    margin-bottom: 0.15rem;
  }

  .diggel-post-reaction__text {
    margin: 0;
    color: #1c1e21;
    line-height: 1.4;
    word-break: break-word;
  }
`;

/**
 * Extended-text interaction that renders the candidate's answer as a social
 * comment bubble once the item is readonly (history posts), and behaves like a
 * normal `<qti-extended-text-interaction>` while answering.
 *
 * Authored as: `<qti-extended-text-interaction class="type:comment" ...>`
 *
 * State comes entirely from the component itself — `this.readonly` (pushed down
 * by `qti-assessment-item`) and `this.response` (set through the item context) —
 * so there is no DOM scraping or document rewriting. The responder persona is
 * read from the active environment at render time.
 */
export class QtiExtendedTextInteractionComment extends QtiExtendedTextInteraction {
  static override styles = mergeStyles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (QtiExtendedTextInteraction as any).styles,
    commentStyles
  );

  private get responseText(): string {
    const value = this.response;
    if (value == null) return '';
    return (Array.isArray(value) ? value.join(' ') : String(value)).trim();
  }

  override render() {
    const text = this.responseText;

    // Swap to the read-only comment bubble once readonly AND there is an answer;
    // otherwise show the editable comment input.
    return !this.readonly || !text
      ? this.#renderCommentInput()
      : this.#renderCommentBubble(text);
  }

  /** Editable state: persona avatar + pill "Write a comment" field. */
  #renderCommentInput() {
    const env = currentEnvironmentConfig();
    const placeholder = this.placeholderText || 'Write a comment';

    return html`
      <div class="comment-input">
        <span class="comment-input__avatar-ring">
          <img
            class="comment-input__avatar"
            src="${env.susanProfilePic}"
            alt=""
          />
        </span>
        <textarea
          class="comment-input__field"
          part="textarea"
          name="${this.responseIdentifier}"
          rows="1"
          spellcheck="false"
          autocomplete="off"
          maxlength="5000"
          placeholder="${placeholder}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readonly}"
          .value="${this.response ?? ''}"
          @keydown="${(event: KeyboardEvent) => event.stopImmediatePropagation()}"
          @keyup="${this.textChanged}"
          @change="${this.textChanged}"
          @blur="${() => this.reportValidity()}"
        ></textarea>
      </div>
    `;
  }

  /** Readonly state: the answer as a social comment bubble. */
  #renderCommentBubble(text: string) {
    const env = currentEnvironmentConfig();

    return html`
      <div class="diggel-post-reaction">
        <img
          class="diggel-post-reaction__avatar"
          src="${env.susanProfilePic}"
          alt=""
        />
        <div class="diggel-post-reaction__body">
          <div class="diggel-post-reaction__bubble">
            <strong class="diggel-post-reaction__name"
              >${env.susanDisplayName}</strong
            >
            <p class="diggel-post-reaction__text">${text}</p>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qti-extended-text-interaction-comment': QtiExtendedTextInteractionComment;
  }
}

if (!customElements.get('qti-extended-text-interaction-comment')) {
  customElements.define(
    'qti-extended-text-interaction-comment',
    QtiExtendedTextInteractionComment
  );
}
