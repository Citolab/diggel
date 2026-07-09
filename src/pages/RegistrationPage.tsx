import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AdvanceButton } from '../components/AdvanceButton';
import { AnimatedEnter } from '../components/AnimatedEnter';
import {
  QtiTestPlayer,
  type QtiTestPlayerHandle,
} from '../components/QtiTestPlayer';
import { SpacebookNavbar } from '../components/layout/EnvChrome';
import { SusanNotification } from '../components/SusanNotification';
import { testPlayerItems, TEST_URL_BY_ENV } from '../data/items';
import { buildItemResult } from '../data/itemResult';
import { ITEM_ADVANCE_DELAY_MS } from '../config/timing';
import { useEnvironment } from '../environments/EnvironmentProvider';
import { useSusanNotifications } from '../hooks/useSusanNotifications';
import { useSession } from '../hooks/useSession';

export function RegistrationPage() {
  const { envId } = useParams<{ envId: string }>();
  const navigate = useNavigate();
  const env = useEnvironment();
  const { session, currentItem, recordResult, advance } = useSession();
  const { activeNotification, showNotification, dismissNotification } =
    useSusanNotifications();
  const testPlayerRef = useRef<QtiTestPlayerHandle>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Continuous save: persist responses off the QTI item context as they change.
  const handleResponsesChanged = useCallback(
    (itemId: string, responses: Record<string, unknown>) => {
      recordResult(buildItemResult(itemId, responses));
    },
    [recordResult]
  );

  const handleNext = useCallback(async () => {
    if (!currentItem || isAdvancing) return;

    setIsAdvancing(true);

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
      advance(result);
      navigate(`/${envId}/feed`);
    } finally {
      setIsAdvancing(false);
    }
  }, [advance, currentItem, envId, isAdvancing, navigate]);

  if (!session.loggedIn || session.environment !== envId) {
    navigate('/welcome');
    return null;
  }

  if (envId !== 'spacebook' && envId !== 'spacegram') {
    return null;
  }

  return (
    <div className="registration-page">
      <SpacebookNavbar />
      <SusanNotification
        notification={activeNotification}
        onDismiss={dismissNotification}
      />
      <main className="registration-page__main">
        <div>
          <AnimatedEnter>
            <QtiTestPlayer
              ref={testPlayerRef}
              testUrl={TEST_URL_BY_ENV[envId]}
              itemId="news"
              items={testPlayerItems(envId)}
              assetBase={env.assetBase}
              className="registration-page__player"
              onSusanNotification={showNotification}
              onResponsesChanged={handleResponsesChanged}
            />
          </AnimatedEnter>
        </div>
        <div className="registration-page__actions">
          <AdvanceButton
            loading={isAdvancing}
            label="Next"
            className="btn btn-primary registration-page__next"
            onClick={() => void handleNext()}
          />
        </div>
      </main>
    </div>
  );
}
