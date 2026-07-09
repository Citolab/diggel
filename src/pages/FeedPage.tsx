import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AdvanceButton } from '../components/AdvanceButton';
import { AnimatedEnter } from '../components/AnimatedEnter';
import { FeedPost } from '../components/FeedPost';
import { FeedPostHeader } from '../components/FeedPostHeader';
import { AppLayout } from '../components/layout/AppLayout';
import {
  QtiTestPlayer,
  type QtiTestPlayerHandle,
} from '../components/QtiTestPlayer';
import { SusanNotification } from '../components/SusanNotification';
import { TEST_URL_BY_ENV } from '../data/items';
import { toTestPlayerItems } from '../data/assessmentStructure';
import { buildItemResult } from '../data/itemResult';
import { ITEM_ADVANCE_DELAY_MS } from '../config/timing';
import { useEnvironment } from '../environments/EnvironmentProvider';
import { useSusanNotifications } from '../hooks/useSusanNotifications';
import { useSession } from '../hooks/useSession';

export function FeedPage() {
  const { envId } = useParams<{ envId: string }>();
  const env = useEnvironment();
  const { session, items, currentItem, recordResult, advance } = useSession();
  // Stable reference so QtiTestPlayer doesn't re-init on every re-render.
  const testPlayerItems = useMemo(() => toTestPlayerItems(items), [items]);
  const { activeNotification, showNotification, dismissNotification } =
    useSusanNotifications();
  const testPlayerRef = useRef<QtiTestPlayerHandle>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);
  const [isPosting, setIsPosting] = useState(false);

  const scrollToCurrentItem = useCallback(() => {
    window.setTimeout(() => {
      currentItemRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  }, []);

  useEffect(() => {
    scrollToCurrentItem();
  }, [currentItem?.id, scrollToCurrentItem]);

  // Continuous save: persist responses off the QTI item context as they change.
  const handleResponsesChanged = useCallback(
    (itemId: string, responses: Record<string, unknown>) => {
      recordResult(buildItemResult(itemId, responses));
    },
    [recordResult]
  );

  const handleNext = useCallback(async () => {
    if (!currentItem || isPosting) return;

    setIsPosting(true);

    try {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      let result;
      if (currentItem.usage === 'regular') {
        // Final flush: read the authoritative context value in case the last
        // change is still within the debounce window.
        const responses = testPlayerRef.current?.collectResponses() ?? {};
        result = buildItemResult(currentItem.id, responses);
      }

      await new Promise((resolve) => window.setTimeout(resolve, ITEM_ADVANCE_DELAY_MS));
      // advance() moves to the next item and, past the last one, sets phase
      // 'end' — the AssessmentPage then renders the end view. No navigation.
      advance(result);
    } finally {
      setIsPosting(false);
    }
  }, [advance, currentItem, isPosting]);

  if (!currentItem || (envId !== 'spacebook' && envId !== 'spacegram')) {
    return null;
  }

  const feedItems = items
    .slice(1, session.currentIndex + 1)
    .filter(
      (item) => item.usage !== 'info' || item.id === currentItem.id
    );
  const historyItems = feedItems.slice(0, -1).reverse();

  return (
    <AppLayout>
      <SusanNotification
        notification={activeNotification}
        onDismiss={dismissNotification}
      />
      <div className="feed-stack">
        <div
          ref={currentItemRef}
          className="feed-stack__current"
          aria-current="step"
        >
          <AnimatedEnter key={currentItem.id}>
            {currentItem.usage === 'regular' ? (
              <article
                className="feed-post card feed-stack__item"
                data-item-id={currentItem.id}
              >
                <div className="feed-post__body">
                  <FeedPostHeader item={currentItem} />
                  <QtiTestPlayer
                    ref={testPlayerRef}
                    testUrl={TEST_URL_BY_ENV[envId]}
                    itemId={currentItem.id}
                    items={testPlayerItems}
                    assetBase={env.assetBase}
                    onSusanNotification={showNotification}
                    onItemReady={scrollToCurrentItem}
                    onResponsesChanged={handleResponsesChanged}
                  />
                </div>
                <footer className="feed-actions">
                  <AdvanceButton
                    loading={isPosting}
                    label="Post"
                    showChevron
                    onClick={() => void handleNext()}
                  />
                </footer>
              </article>
            ) : (
              <div className="feed-stack__item">
                <QtiTestPlayer
                  ref={testPlayerRef}
                  testUrl={TEST_URL_BY_ENV[envId]}
                  itemId={currentItem.id}
                  items={testPlayerItems}
                  assetBase={env.assetBase}
                  onSusanNotification={showNotification}
                  onItemReady={scrollToCurrentItem}
                  onResponsesChanged={handleResponsesChanged}
                />
                <footer className="feed-actions">
                  <AdvanceButton
                    loading={isPosting}
                    label="Continue"
                    onClick={() => void handleNext()}
                  />
                </footer>
              </div>
            )}
          </AnimatedEnter>
        </div>
        {historyItems.map((item) => (
          <FeedPost
            key={item.id}
            item={item}
            readonly
            savedResult={session.results.find((result) => result.id === item.id)}
          />
        ))}
      </div>
    </AppLayout>
  );
}
