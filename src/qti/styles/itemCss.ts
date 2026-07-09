import type { EnvironmentId } from '../../environments/config';

import baseCss from './item.base.css?inline';
import spacebookCss from './item.spacebook.css?inline';
import spacegramCss from './item.spacegram.css?inline';

const STYLES_BY_ENVIRONMENT: Record<EnvironmentId, string> = {
  spacebook: `${baseCss}\n${spacebookCss}`,
  spacegram: `${baseCss}\n${spacegramCss}`,
};

/** Injected into QTI test-container / item-container shadow roots. */
export function getDiggelQtiItemStyles(environmentId: EnvironmentId): string {
  return STYLES_BY_ENVIRONMENT[environmentId];
}
