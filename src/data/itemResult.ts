import type { ItemResult } from '../types';

/**
 * Build an {@link ItemResult} from response values read off the QTI item context.
 *
 * `score`/`totalScore` are placeholders (0) until response processing supplies
 * real SCORE outcomes — see Phase 1. Multi-value answers are space-joined to
 * match the stored format `FeedPost` expects.
 */
export function buildItemResult(
  id: string,
  responses: Record<string, unknown>
): ItemResult {
  return {
    id,
    responses: Object.entries(responses).map(([interactionId, value]) => ({
      interactionId,
      value: Array.isArray(value) ? value.join(' ') : String(value ?? ''),
      score: 0,
    })),
    totalScore: 0,
  };
}
