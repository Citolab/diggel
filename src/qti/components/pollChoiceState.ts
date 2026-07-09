import { distributePollPercentages } from './pollPercentages';

type PollChoice = HTMLElement & {
  internals?: ElementInternals;
  response?: string | string[] | null;
  responseIdentifier?: string;
};

function isChoiceChecked(choice: PollChoice): boolean {
  return (
    choice.getAttribute('aria-checked') === 'true' ||
    choice.hasAttribute('data-poll-selected') ||
    Boolean(choice.internals?.states.has('--checked'))
  );
}

function isInteractionReadonly(interaction: HTMLElement): boolean {
  if (
    interaction.hasAttribute('readonly') ||
    interaction.getAttribute('aria-readonly') === 'true'
  ) {
    return true;
  }

  const item = interaction.closest('qti-assessment-item') as
    | (HTMLElement & { readonly?: boolean })
    | null;

  return Boolean(item?.readonly || item?.hasAttribute('readonly'));
}

function getPollSeed(interaction: HTMLElement): string {
  const item = interaction.closest('qti-assessment-item');
  const itemId = item?.getAttribute('identifier') ?? 'poll';
  const choiceCount = interaction.querySelectorAll('qti-simple-choice').length;
  return `${itemId}-${choiceCount}`;
}

function selectedTokens(saved: unknown): string[] {
  if (saved == null || saved === '') return [];
  const raw = Array.isArray(saved) ? saved.join(' ') : String(saved);
  return raw.split(/[\s,]+/).map((token) => token.trim()).filter(Boolean);
}

export interface SyncPollChoiceStateOptions {
  savedResponse?: string;
  forceReveal?: boolean;
  /** Keep bars at 0% until a follow-up sync enables reveal (for CSS width animation). */
  deferReveal?: boolean;
}

export function syncPollChoiceState(
  interaction: ParentNode,
  options: SyncPollChoiceStateOptions = {}
): void {
  const host = interaction as HTMLElement;
  const readonly = isInteractionReadonly(host) || options.forceReveal === true;
  const choices = [...interaction.querySelectorAll('qti-simple-choice')];
  const savedTokens = options.savedResponse
    ? selectedTokens(options.savedResponse)
    : [];

  const reveal =
    (readonly || options.forceReveal === true) && options.deferReveal !== true;

  choices.forEach((choice) => {
    const el = choice as PollChoice;
    const identifier = choice.getAttribute('identifier');
    const checked =
      savedTokens.length > 0
        ? identifier != null && savedTokens.includes(identifier)
        : isChoiceChecked(el);

    choice.toggleAttribute('data-poll-selected', reveal && checked);
    choice.toggleAttribute('data-poll-readonly', readonly);
  });
  const percentages = distributePollPercentages(choices.length, getPollSeed(host));

  choices.forEach((choice, index) => {
    const el = choice as PollChoice;
    el.style.setProperty('--poll-percent', reveal ? `${percentages[index]}%` : '0%');
    choice.toggleAttribute('data-poll-reveal', reveal);
  });
}
