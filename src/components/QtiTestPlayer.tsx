import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import '@citolab/qti-components/qti-test';
import type { IQtiTest } from '@citolab/qti-components/qti-test';
import type { QtiAssessmentItemRef } from '@citolab/qti-components/qti-test';
import type { CustomElements } from '@citolab/qti-components/react';

import { applyDiggelImageConstraintsDeep } from '../qti/transform/diggelImageConstraints';
import { scheduleAssetUrlFix } from '../qti/transform/resolveDiggelAssetUrl';
import { applyDiggelItemTransform } from '../qti/transform/applyDiggelItemTransform';
import { applyDiggelTestTransform } from '../qti/transform/applyDiggelTestTransform';
import {
  DIGGEL_SUSAN_READY,
  type DiggelSusanReadyDetail,
} from '../qti/components/div-susan';
import { useEnvironment } from '../environments/EnvironmentProvider';
import { getDiggelQtiItemStyles } from '../qti/styles/itemCss';
import {
  collectInteractionResponses,
  findAssessmentItems,
  responsesFromVariables,
  type ItemContextLike,
} from '../qti/responses/collectQtiResponses';
import {
  injectFollowChoiceStyles,
  injectLikeChoiceStyles,
  injectPollChoiceStyles,
  injectRegistrationSectionStyles,
} from '../qti/styles/injectQtiStyles';
import {
  extractSusanNotificationFromDom,
} from '../qti/transform/extractSusanNotification';
import type { SusanNotificationPayload } from '../types';

import '../qti/components/registerDiggelQtiComponents';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements extends CustomElements {}
  }
}

export interface TestPlayerItemMeta {
  identifier: string;
  title: string;
  usage: 'info' | 'regular';
}

export interface QtiTestPlayerHandle {
  collectResponses: () => Record<string, unknown>;
}

interface QtiTestPlayerProps {
  testUrl: string;
  itemId: string;
  items: TestPlayerItemMeta[];
  assetBase: string;
  readonly?: boolean;
  className?: string;
  onSusanNotification?: (payload: SusanNotificationPayload) => void;
  onItemReady?: () => void;
  /**
   * Fired (debounced) whenever an item's context changes, sourced from the
   * `qti-item-context-updated` event — the canonical "state changed, save it"
   * signal. `responses` are read from the item context, not the DOM.
   */
  onResponsesChanged?: (
    itemId: string,
    responses: Record<string, unknown>
  ) => void;
}

const RESPONSES_SAVE_DEBOUNCE_MS = 400;

type QtiTestElement = IQtiTest & {
  navigateTo?: (type: 'item' | 'section', id?: string) => void;
  postLoadTransformCallback?: (
    transformer: Parameters<typeof applyDiggelItemTransform>[0],
    itemRef: QtiAssessmentItemRef
  ) => ReturnType<typeof applyDiggelItemTransform>;
  postLoadTestTransformCallback?: (
    transformer: Parameters<typeof applyDiggelTestTransform>[0],
    testElement: Parameters<typeof applyDiggelTestTransform>[1]
  ) => ReturnType<typeof applyDiggelTestTransform>;
};

// Memoized: an answer triggers a debounced session save (recordResult) which
// re-renders the feed. Without memo, this player re-renders and re-touches
// <test-container>, remounting the item (a visible content/scrollbar flash).
// All props are stable references, so memo skips those re-renders.
export const QtiTestPlayer = memo(
  forwardRef<QtiTestPlayerHandle, QtiTestPlayerProps>(function QtiTestPlayer(
    {
      testUrl,
      itemId,
      items,
      assetBase,
      readonly = false,
      className,
      onSusanNotification,
      onItemReady,
      onResponsesChanged,
    },
    ref
  ) {
  const env = useEnvironment();
  const testRef = useRef<QtiTestElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const lastNavigatedRef = useRef<string | null>(null);
  const notificationShownRef = useRef(false);
  const assetBaseRef = useRef(assetBase);
  const onResponsesChangedRef = useRef(onResponsesChanged);
  const saveTimerRef = useRef<number | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      collectResponses: () => {
        const container = containerRef.current;
        if (!container) return {};
        return collectInteractionResponses(container);
      },
    }),
    []
  );

  useEffect(() => {
    assetBaseRef.current = assetBase;
  }, [assetBase]);

  useEffect(() => {
    onResponsesChangedRef.current = onResponsesChanged;
  }, [onResponsesChanged]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    notificationShownRef.current = false;
  }, [itemId]);

  const navigateToItem = useCallback((targetId: string, force = false) => {
    const test = testRef.current;
    if (!test || (!force && lastNavigatedRef.current === targetId)) return;

    if (typeof test.navigateTo === 'function') {
      test.navigateTo('item', targetId);
    } else {
      test.dispatchEvent(
        new CustomEvent('qti-request-navigation', {
          detail: { type: 'item', id: targetId },
          bubbles: true,
          composed: true,
        })
      );
    }

    lastNavigatedRef.current = targetId;
  }, []);

  const showSusan = useCallback(
    (html: string) => {
      if (!onSusanNotification || notificationShownRef.current || !html.trim()) {
        return;
      }
      notificationShownRef.current = true;
      onSusanNotification({ itemId, html });
    },
    [itemId, onSusanNotification]
  );

  const applyLayoutStyles = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const roots: ParentNode[] = [container];
    if (container.shadowRoot) roots.push(container.shadowRoot);

    for (const root of roots) {
      injectRegistrationSectionStyles(root);
      injectFollowChoiceStyles(root);
      injectLikeChoiceStyles(root);
      injectPollChoiceStyles(root);
    }
  }, []);

  useEffect(() => {
    const test = testRef.current;
    if (!test) return;

    test.postLoadTransformCallback = (transformer, itemRef) =>
      applyDiggelItemTransform(transformer, itemRef, assetBaseRef.current);
    test.postLoadTestTransformCallback = applyDiggelTestTransform;
  }, [isConnected]);

  useEffect(() => {
    const onTestConnected = () => setIsConnected(true);
    document.addEventListener(
      'qti-assessment-test-connected',
      onTestConnected
    );
    return () =>
      document.removeEventListener(
        'qti-assessment-test-connected',
        onTestConnected
      );
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    navigateToItem(itemId, true);
  }, [isConnected, itemId, navigateToItem]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onSusanReady = (event: Event) => {
      const detail = (event as CustomEvent<DiggelSusanReadyDetail>).detail;
      if (detail?.html) showSusan(detail.html);
    };

    const onItemConnected = () => {
      applyLayoutStyles();
      scheduleAssetUrlFix(container);
      applyDiggelImageConstraintsDeep(container);

      const notification = extractSusanNotificationFromDom(container);
      if (notification) showSusan(notification);

      const assessmentItem = findAssessmentItems(container)[0];
      if (assessmentItem) {
        assessmentItem.readonly = readonly;
      }

      onItemReady?.();
    };

    const onInteractionChanged = () => {
      applyLayoutStyles();
    };

    const onItemContextUpdated = (event: Event) => {
      const itemContext = (
        event as CustomEvent<{ itemContext: ItemContextLike }>
      ).detail?.itemContext;
      if (!itemContext?.identifier || !onResponsesChangedRef.current) return;

      // Debounce so rapid typing/clicking collapses into one save. The context
      // itself is authoritative; we just read the response variables off it.
      const identifier = itemContext.identifier;
      const responses = responsesFromVariables(itemContext.variables);
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = window.setTimeout(() => {
        saveTimerRef.current = null;
        onResponsesChangedRef.current?.(identifier, responses);
      }, RESPONSES_SAVE_DEBOUNCE_MS);
    };

    container.addEventListener(DIGGEL_SUSAN_READY, onSusanReady);
    container.addEventListener(
      'qti-assessment-item-connected',
      onItemConnected as EventListener
    );
    container.addEventListener(
      'qti-interaction-changed',
      onInteractionChanged as EventListener
    );
    container.addEventListener(
      'qti-item-context-updated',
      onItemContextUpdated as EventListener
    );

    return () => {
      container.removeEventListener(DIGGEL_SUSAN_READY, onSusanReady);
      container.removeEventListener(
        'qti-assessment-item-connected',
        onItemConnected as EventListener
      );
      container.removeEventListener(
        'qti-interaction-changed',
        onInteractionChanged as EventListener
      );
      container.removeEventListener(
        'qti-item-context-updated',
        onItemContextUpdated as EventListener
      );
    };
  }, [applyLayoutStyles, onItemReady, readonly, showSusan]);

  useEffect(() => {
    const test = testRef.current;
    if (!test) return;

    const onTestLoaded = () => applyLayoutStyles();
    test.addEventListener('qti-test-loaded', onTestLoaded);
    return () => test.removeEventListener('qti-test-loaded', onTestLoaded);
  }, [applyLayoutStyles, isConnected]);

  // Memoized so re-renders (e.g. after recordResult on answer) don't hand
  // test-navigation a new array — that re-initializes the test and remounts the
  // item, which resets the page scroll.
  const initContext = useMemo(
    () =>
      items.map((item) => {
        const regularItems = items.filter((i) => i.usage !== 'info');
        const seqNr =
          item.usage === 'info'
            ? -1
            : regularItems.findIndex((i) => i.identifier === item.identifier);

        return {
          identifier: item.identifier,
          name: item.title,
          seqNr,
          completionStatus: 'not-attempted',
          score: 0,
          maxScore: 0,
        };
      }),
    [items]
  );

  return (
    <div className={className ? `qti-test-player ${className}` : 'qti-test-player'}>
      <qti-test ref={testRef} className="qti-test-player__host">
        <test-navigation initContext={initContext}>
          <test-container ref={containerRef} test-url={testUrl}>
            <template
              dangerouslySetInnerHTML={{
                __html: `<style>${getDiggelQtiItemStyles(env.id)}</style>`,
              }}
            />
          </test-container>
        </test-navigation>
      </qti-test>
    </div>
  );
  })
);


