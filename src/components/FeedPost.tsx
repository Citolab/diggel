import { t } from '../data/translations';
import { friendAvatarUrl } from '../environments/config';
import { useEnvironment } from '../environments/EnvironmentProvider';
import type { ItemDefinition, ItemResult } from '../types';

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
  const time = new Date().toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

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

  const avatar =
    author === env.susanDisplayName
      ? env.susanProfilePic
      : friendAvatarUrl(env, author);

  return (
    <article
      className={`feed-post card${readonly ? ' feed-post--readonly' : ''}`}
      data-item-id={item.id}
      inert={readonly || undefined}
      aria-disabled={readonly || undefined}
    >
      {isSusanComposing && (
        <div className="feed-post__compose-header">
          <img className="profile" src={avatar} alt="" />
          <div className="feed-post__compose-tab">{t.SPACEBOOK_POST}</div>
        </div>
      )}
      <div className="feed-post__body">
        {!isSusanComposing && (
          <div className="feed-post__author-row">
            <img className="profile" src={avatar} alt="" />
            <div className="feed-post__author-meta">
              <div className="feed-post__author-name">{author}</div>
              <span className="feed-post__time">
                {t.SPACEBOOK_POSTED} {time}
              </span>
            </div>
          </div>
        )}
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
