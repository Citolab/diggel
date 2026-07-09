import { useCallback, useState } from 'react';

import type { SusanNotificationPayload } from '../types';

export function useSusanNotifications() {
  const [notifications, setNotifications] = useState<
    SusanNotificationPayload[]
  >([]);
  const [activeNotification, setActiveNotification] =
    useState<SusanNotificationPayload | null>(null);

  const showNotification = useCallback((payload: SusanNotificationPayload) => {
    setNotifications((prev) => [...prev, payload]);
    setActiveNotification(payload);
  }, []);

  const dismissNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  return {
    notifications,
    activeNotification,
    showNotification,
    dismissNotification,
  };
}
