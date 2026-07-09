import {
  qtiTransformItem,
  type transformTestApi,
} from '@citolab/qti-components/qti-transformers';
import type { QtiAssessmentTest } from '@citolab/qti-components/qti-test';

import { TYPE_CLASS_PREFIX } from './processQtiItem';

/**
 * Post-load transform for the assessment test itself (wired via
 * postLoadTestTransformCallback). Upgrades authored `class="type:*"` elements in
 * the test — e.g. the `<div class="type:registration-steps">` in a section
 * rubric block — into their extended custom-element tags, exactly like item
 * content does with extendElementsWithClass. Keeps the authored test valid QTI.
 */
export function applyDiggelTestTransform(
  transformer: transformTestApi,
  _testElement: QtiAssessmentTest
): transformTestApi {
  const converted = qtiTransformItem()
    .parse(transformer.xml())
    .extendElementsWithClass(TYPE_CLASS_PREFIX)
    .xml();

  return transformer.parse(converted);
}
