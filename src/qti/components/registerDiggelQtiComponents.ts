/**
 * Diggel-specific QTI web components.
 *
 * Element names are produced at transform time by extendElementsWithClass('type'):
 *   <div class="type:susan">           → <div-susan>
 *   <qti-choice-interaction class="type:poll">  → <qti-choice-interaction-poll>
 *
 * Keep registered custom elements in sync with type:* classes used in item XML.
 */
import './div-susan';
import './div-registration-steps';
import './qti-choice-interaction-poll';
import './qti-choice-interaction-like';
import './qti-choice-interaction-follow';
import './qti-extended-text-interaction-comment';
import './qti-order-interaction-photostory';

/** type:* suffixes that have a registered web component. */
export const REGISTERED_TYPE_EXTENSIONS = [
  'susan',
  'poll',
  'like',
  'follow',
  'comment',
  'photostory',
  'registration-steps',
] as const;

export type RegisteredTypeExtension =
  (typeof REGISTERED_TYPE_EXTENSIONS)[number];
