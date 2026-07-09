import { css, type CSSResultGroup } from 'lit';

export const pollStyles = css`
  :host {
    display: block;
    width: 100%;
  }
`;

export const likeStyles = css`
  :host {
    display: block;
  }

  ::slotted(qti-simple-choice) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid #dee2e6;
    border-radius: 999px;
    padding: 0.4rem 1rem;
    margin: 0.25rem;
    cursor: pointer;
  }
`;

export const followStyles = css`
  :host {
    display: block;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.75rem 0;
    background: #fff;
  }

  ::slotted(qti-simple-choice) {
    display: block;
    border: 1px solid #e9ecef;
    border-radius: 0.375rem;
    padding: 0.75rem;
    margin: 0.5rem 0;
    cursor: pointer;
  }

  ::slotted(qti-simple-choice:hover) {
    border-color: #0d6efd;
    background: #f8f9ff;
  }
`;

export function mergeStyles(
  ...groups: Array<CSSResultGroup | undefined>
): CSSResultGroup {
  return groups.flatMap((group) => {
    if (!group) return [];
    return Array.isArray(group) ? group : [group];
  });
}
