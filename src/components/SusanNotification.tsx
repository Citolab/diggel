import { useEnvironment } from '../environments/EnvironmentProvider';
import type { SusanNotificationPayload } from '../types';

interface SusanNotificationProps {
  notification: SusanNotificationPayload | null;
  onDismiss: () => void;
}

export function SusanNotification({
  notification,
  onDismiss,
}: SusanNotificationProps) {
  const env = useEnvironment();

  if (!notification) {
    return null;
  }

  const time = new Date().toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="susan-toast susan-toast--visible diggel-animate diggel-animate--slide-in-down"
      role="alert"
      aria-live="polite"
    >
      <div className="susan-toast__header">
        <img
          src={`${env.assetBase}/profile-pics/shutterstock_1257452734.png`}
          className="profile-sm"
          alt=""
        />
        <div>
          <strong className="text-verdana">Susan</strong>
          <br />
          <small>{time}</small>
        </div>
        <span className="susan-toast__icon" aria-hidden="true">
          💬
        </span>
        <button
          type="button"
          className="susan-toast__close"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div
        className="susan-toast__body text-verdana"
        dangerouslySetInnerHTML={{ __html: notification.html }}
      />
    </div>
  );
}
