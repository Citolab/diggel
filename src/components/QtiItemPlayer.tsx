import { useEffect, useRef, useState } from 'react';

import {
  DIGGEL_SUSAN_READY,
  type DiggelSusanReadyDetail,
} from '../qti/components/div-susan';
import {
  extractSusanNotificationFromDom,
  extractSusanNotificationFromXml,
} from '../qti/transform/extractSusanNotification';
import { useEnvironment } from '../environments/EnvironmentProvider';
import { processQtiItem } from '../qti/transform/processQtiItem';
import type { ItemDefinition, SusanNotificationPayload } from '../types';

import { scheduleAssetUrlFix } from '../qti/transform/resolveDiggelAssetUrl';
import {
  injectLikeChoiceStyles,
  injectPollChoiceStyles,
} from '../qti/styles/injectQtiStyles';
import {
  applySavedResponsesToInteractions,
  collectInteractionResponses,
  findAssessmentItems,
} from '../qti/responses/collectQtiResponses';
import { getDiggelQtiItemStyles } from '../qti/styles/itemCss';

import '../qti/components/registerDiggelQtiComponents';

type ItemContainerElement = HTMLElement & { itemDoc?: DocumentFragment };

interface QtiItemPlayerProps {
  item: ItemDefinition;
  readonly?: boolean;
  savedResponses?: Record<string, unknown>;
  variant?: 'default' | 'embedded' | 'hero';
  onSusanNotification?: (payload: SusanNotificationPayload) => void;
  onReady?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QtiItem = 'qti-item' as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ItemContainer = 'item-container' as any;

export function QtiItemPlayer({
  item,
  readonly = false,
  savedResponses,
  variant = 'default',
  onSusanNotification,
  onReady,
}: QtiItemPlayerProps) {
  const env = useEnvironment();
  const [itemDoc, setItemDoc] = useState<DocumentFragment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const itemContainerRef = useRef<ItemContainerElement>(null);
  const notificationShownRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    notificationShownRef.current = false;
    setLoading(true);
    setError(null);
    setItemDoc(null);

    void (async () => {
      try {
        const processed = await processQtiItem(item.href, {
          assetBase: env.assetBase,
        });
        if (cancelled) return;

        // Readonly rendering is handled by the extended interaction components
        // themselves (they watch `readonly` + `response` from the item context),
        // so the document is mounted as-authored — no rewriting here.
        setItemDoc(processed.itemDoc);

        const notificationHtml =
          extractSusanNotificationFromXml(processed.rawXml) ??
          extractSusanNotificationFromDom(processed.itemDoc);

        if (
          notificationHtml &&
          onSusanNotification &&
          !notificationShownRef.current
        ) {
          notificationShownRef.current = true;
          onSusanNotification({ itemId: item.id, html: notificationHtml });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load item');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [item.href, item.id, onSusanNotification, env.assetBase, readonly, savedResponses]);

  useEffect(() => {
    const container = itemContainerRef.current;
    if (!container || !itemDoc) return;

    container.itemDoc = itemDoc;
    container.dispatchEvent(new Event('itemdoc-changed', { bubbles: true }));

    const onSusanReady = (event: Event) => {
      if (notificationShownRef.current || !onSusanNotification) return;
      const detail = (event as CustomEvent<DiggelSusanReadyDetail>).detail;
      if (!detail?.html) return;

      notificationShownRef.current = true;
      onSusanNotification({ itemId: item.id, html: detail.html });
    };

    container.addEventListener(DIGGEL_SUSAN_READY, onSusanReady);
    return () => container.removeEventListener(DIGGEL_SUSAN_READY, onSusanReady);
  }, [itemDoc, item.id, onSusanNotification]);

  useEffect(() => {
    if (!itemDoc || loading) return;

    const pollForAssessmentItem = () => {
      const root = itemContainerRef.current;
      if (!root) return false;

      const assessmentItem = findAssessmentItems(root)[0];
      if (!assessmentItem) return false;

      assessmentItem.readonly = readonly;

      if (readonly && savedResponses) {
        // Restore through the item context (variables setter), which also pushes
        // the values into the interactions — no direct interaction/DOM poking.
        applySavedResponsesToInteractions(root, savedResponses);
      }

      scheduleAssetUrlFix(root);
      injectPollChoiceStyles(root);
      injectLikeChoiceStyles(root);

      // Readonly reveal for poll/like (and the extended-text comment) is handled
      // by the interaction components themselves, off their own readonly/response
      // state restored above — no per-item scheduler needed.

      if (!notificationShownRef.current && onSusanNotification) {
        const domNotification = extractSusanNotificationFromDom(root);
        if (domNotification) {
          notificationShownRef.current = true;
          onSusanNotification({ itemId: item.id, html: domNotification });
        }
      }

      onReady?.();
      return true;
    };

    if (pollForAssessmentItem()) return;

    const interval = window.setInterval(() => {
      if (pollForAssessmentItem()) {
        window.clearInterval(interval);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [itemDoc, item.id, loading, onReady, onSusanNotification, readonly, savedResponses]);

  if (loading) {
    return (
      <div className="qti-item-player qti-item-player--loading">Loading…</div>
    );
  }

  if (error) {
    return (
      <div className="qti-item-player qti-item-player--error">{error}</div>
    );
  }

  const content = (
    <div
      className={`qti-item-player qti-item-player--${variant}${readonly ? ' qti-item-player--readonly' : ''}`}
      data-item-id={item.id}
    >
      <QtiItem style={{ display: 'block', width: '100%' }}>
        <ItemContainer
          ref={itemContainerRef}
          style={{ display: 'block', width: '100%' }}
          {...(!readonly ? {} : { inert: '' as const })}
        >
          <template
            dangerouslySetInnerHTML={{
              __html: `<style>${getDiggelQtiItemStyles(env.id)}</style>`,
            }}
          />
        </ItemContainer>
      </QtiItem>
    </div>
  );

  if (variant === 'embedded' || variant === 'hero') {
    return content;
  }

  return <article className="feed-post card">{content}</article>;
}

export function collectItemResponses(
  root: ParentNode
): Record<string, unknown> {
  return collectInteractionResponses(root);
}
