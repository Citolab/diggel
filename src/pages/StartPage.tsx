import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useEnvironment } from '../environments/EnvironmentProvider';
import { t } from '../data/translations';
import { useSession } from '../hooks/useSession';
import { SusanNotification } from '../components/SusanNotification';

export function StartPage() {
  const { envId } = useParams<{ envId: string }>();
  const navigate = useNavigate();
  const env = useEnvironment();
  const { beginRegistration, session } = useSession();
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

  if (!session.loggedIn || session.environment !== envId) {
    navigate('/welcome');
    return null;
  }

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
        onClick={() => {
          beginRegistration();
          navigate(`/${envId}/registration`);
        }}
      >
        {t.SPACEBOOK_START}
      </button>
    </div>
  );
}
