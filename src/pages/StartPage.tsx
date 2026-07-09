import { useEffect, useState } from 'react';

import { useEnvironment } from '../environments/EnvironmentProvider';
import { t } from '../data/translations';
import { useSession } from '../hooks/useSession';
import { SusanNotification } from '../components/SusanNotification';

export function StartPage() {
  const env = useEnvironment();
  const { beginRegistration } = useSession();
  const [showButton, setShowButton] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowButton(true), 1500);
    const t2 = window.setTimeout(() => setToast(true), 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="start-page"
      style={{ backgroundImage: `url('${env.splashEn}')` }}
    >
      <SusanNotification
        notification={
          toast
            ? {
                itemId: 'start',
                html: `<p>${t.SPACEBOOK_WELCOME_MESSAGE}</p>`,
              }
            : null
        }
        onDismiss={() => setToast(false)}
      />
      <button
        type="button"
        className={`start-page__btn btn btn-primary btn-lg ${showButton ? 'start-page__btn--visible' : ''}`}
        onClick={() => beginRegistration()}
      >
        {t.SPACEBOOK_START}
      </button>
    </div>
  );
}
