export type VariableValue = {
  identifier: string;
  value: string | string[] | null;
  type?: 'response' | 'outcome' | 'template' | string;
};

/** Shape of the detail carried by the `qti-item-context-updated` event. */
export type ItemContextLike = {
  identifier?: string;
  variables?: VariableValue[];
};

/**
 * The `<qti-assessment-item>` element owns the item's response/outcome state as
 * its `variables` (backed by the item context). Read and restore go through this
 * accessor — never by scraping interaction DOM — so the context stays the single
 * source of truth. The setter also propagates values down to the interactions.
 */
export type QtiAssessmentItemElement = HTMLElement & {
  variables?: VariableValue[];
  readonly?: boolean;
};

export function walkShadowRoots(
  root: ParentNode,
  visit: (node: ParentNode) => void
): void {
  visit(root);

  // `item-container` / `test-container` render the item into their OWN shadow
  // root (Lit default), so we must descend into the root element's shadow root,
  // not only its descendants'. Missing this is why response collection came back
  // empty for the live item.
  const ownShadow = (root as Element).shadowRoot;
  if (ownShadow) {
    walkShadowRoots(ownShadow, visit);
  }

  root.querySelectorAll('*').forEach((el) => {
    if (el.shadowRoot) {
      walkShadowRoots(el.shadowRoot, visit);
    }
  });
}

/** All `<qti-assessment-item>` elements under `root`, piercing shadow roots. */
export function findAssessmentItems(root: ParentNode): QtiAssessmentItemElement[] {
  const items: QtiAssessmentItemElement[] = [];
  walkShadowRoots(root, (node) => {
    node
      .querySelectorAll('qti-assessment-item')
      .forEach((el) => items.push(el as unknown as QtiAssessmentItemElement));
  });
  return items;
}

function isEmptyResponse(value: string | string[] | null | undefined): boolean {
  return (
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
}

/**
 * Built-in response-typed variables that are bookkeeping, not candidate answers.
 * qti-components declares `numAttempts` with `type: 'response'`, so a plain
 * `type === 'response'` filter would wrongly capture it.
 */
const RESERVED_RESPONSE_IDENTIFIERS = new Set(['numAttempts']);

/** Extract non-empty response values from a set of item-context variables. */
export function responsesFromVariables(
  variables: VariableValue[] | undefined
): Record<string, unknown> {
  const responses: Record<string, unknown> = {};
  if (!Array.isArray(variables)) return responses;

  for (const variable of variables) {
    if (variable.type !== 'response') continue;
    if (RESERVED_RESPONSE_IDENTIFIERS.has(variable.identifier)) continue;
    if (isEmptyResponse(variable.value)) continue;
    responses[variable.identifier] = variable.value;
  }

  return responses;
}

/** Collect current response values from the item context of every rendered item. */
export function collectInteractionResponses(
  root: ParentNode
): Record<string, unknown> {
  const responses: Record<string, unknown> = {};
  for (const item of findAssessmentItems(root)) {
    Object.assign(responses, responsesFromVariables(item.variables));
  }
  return responses;
}

/**
 * Restore stored session values into the item context (readonly history / resume).
 * Assigns through the `variables` setter, which merges by identifier and pushes the
 * values into the matching interaction elements — no direct DOM manipulation.
 */
export function applySavedResponsesToInteractions(
  root: ParentNode,
  savedResponses: Record<string, unknown>
): void {
  const restore: VariableValue[] = Object.entries(savedResponses)
    .filter(([, value]) => !isEmptyResponse(value as string | string[] | null))
    .map(([identifier, value]) => ({
      identifier,
      value: value as string | string[],
    }));

  if (restore.length === 0) return;

  for (const item of findAssessmentItems(root)) {
    item.variables = restore;
  }
}
