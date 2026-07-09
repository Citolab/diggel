import { t } from '../data/translations';
import { useEnvironment } from '../environments/EnvironmentProvider';
import type { ItemDefinition, ItemResult } from '../types';

import { FeedPostHeader } from './FeedPostHeader';
import { QtiItemPlayer } from './QtiItemPlayer';

interface FeedPostProps {
  item: ItemDefinition;
  readonly?: boolean;
  savedResult?: ItemResult;
  onSusanNotification?: Parameters<typeof QtiItemPlayer>[0]['onSusanNotification'];
}

export function FeedPost({
  item,
  readonly = false,
  savedResult,
  onSusanNotification,
}: FeedPostProps) {
  const env = useEnvironment();

  if (item.id.startsWith('welcome-')) {
    return (
      <div className={readonly ? 'feed-post--readonly' : undefined} inert={readonly || undefined}>
        <QtiItemPlayer
          item={item}
          readonly={readonly}
          savedResponses={savedResultToResponses(savedResult)}
          onSusanNotification={readonly ? undefined : onSusanNotification}
          variant="hero"
        />
      </div>
    );
  }

  const author = item.author ?? env.susanDisplayName;
  const isSusanComposing = author === env.susanDisplayName && !readonly;

  return (
    <article
      className={`feed-post card${readonly ? ' feed-post--readonly' : ''}`}
      data-item-id={item.id}
      inert={readonly || undefined}
      aria-disabled={readonly || undefined}
    >
      {isSusanComposing && (
        <div className="feed-post__compose-header">
          <img className="profile" src={env.susanProfilePic} alt="" />
          <div className="feed-post__compose-tab">{t.SPACEBOOK_POST}</div>
        </div>
      )}
      <div className="feed-post__body">
        {!isSusanComposing && <FeedPostHeader item={item} />}
        <QtiItemPlayer
          item={item}
          readonly={readonly}
          savedResponses={savedResultToResponses(savedResult)}
          onSusanNotification={readonly ? undefined : onSusanNotification}
          variant="embedded"
        />
      </div>
    </article>
  );
}

function savedResultToResponses(
  result?: ItemResult
): Record<string, unknown> | undefined {
  if (!result?.responses.length) return undefined;

  return Object.fromEntries(
    result.responses.map(({ interactionId, value }) => [
      interactionId,
      value.includes(' ') ? value.split(' ') : value,
    ])
  );
}
